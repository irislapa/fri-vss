#imports
import numpy as np
from io import StringIO as io
from csv import DictReader
import csv
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
from pip import main
from scipy.stats import pearsonr
from pickle import load
from os.path import join
from scipy.sparse import issparse
import collections
import random
#

class MovieRecommender:
    def __init__(self):
        self.movie_titles = []
        self.mt = {}
        self.movie_genres = {}
        self.genres = set()
        self.movie_references = {}
        self.movie_titlesDict = {}

        reader = DictReader(open('podatki/ml-latest-small/movies.csv', 'rt', encoding='utf-8'))
        for row in reader:
            current_row_genres = row["genres"].split("|")
            self.movie_references[int(row["movieId"])] = []
            for genre in current_row_genres:
                if genre != "(no genres listed)":
                    self.movie_references[int(row["movieId"])].append(str(genre))
            self.movie_genres[int(row["movieId"])] = current_row_genres
            self.movie_references[int(row["movieId"])].append(row["title"])
            self.movie_titles.append((int(row["movieId"]), row["title"]))
            self.movie_titlesDict[int(row["movieId"])] = row["title"].lower()
            self.mt[int(row["movieId"])] = row["title"]
            for genr in current_row_genres:
                self.genres.add(genr)

        self.movie_titles_arr = np.array(self.movie_titles)

        for movie in self.movie_references:
            references = self.movie_references[movie]
            for reference in references:
                reference = reference.lower()

        reader = DictReader(open('podatki/ml-latest-small/tags.csv', 'rt', encoding='utf-8'))
        for row in reader:
            self.movie_references[int(row["movieId"])].append(row["tag"])


        df_ratings = pd.read_csv('podatki/ml-latest-small/ratings.csv')
        movies = df_ratings['movieId'].to_numpy().tolist()
        movief = dict(collections.Counter(movies))
        dtf = [('movieId', 'int'), ('contributions', 'int')]
        movief_arr = np.array(list(movief.items()), dtype = dtf)
        df_movies = pd.DataFrame(movief_arr, columns = ['movieId', 'contributions'])
        self.movie_arr = df_movies.to_numpy()
        df_Rc = pd.DataFrame(self.movie_arr, columns=['movieId', 'ratingCount'])
        nonRated = []
        for movie in self.movie_titles_arr:
            if int(movie[0]) not in self.movie_arr[:,0]:
                nonRated.append(int(movie[0]))

        df_T = pd.DataFrame(self.movie_titles_arr, columns = ['movieId', 'title'])
        df_Rc['movieId'] = df_Rc['movieId'].astype(int)
        df_T['movieId'] = df_T['movieId'].astype(int)
        self.df_TRc = pd.merge(df_Rc, df_T)

        users = df_ratings['userId'].to_numpy().tolist()
        userf = dict(collections.Counter(users))
        dtf = [('userId', 'int'), ('contributions', 'int')]
        userf_arr = np.array(list(userf.items()), dtype = dtf)
        self.df_users = pd.DataFrame(userf_arr, columns = ['userId', 'contributions'])
        self.users_arr = self.df_users.to_numpy()

        count = 0
        for uporabnik in userf_arr:
            count += uporabnik[1]

        df_ratings['movieId'] = df_ratings['movieId'].astype(int)
        df_RcRatings = df_ratings
        print(len(df_ratings))
        RcRatings_arr = df_RcRatings.to_numpy()
        self.movie_users = {}
        setOfUsers = set(list(self.users_arr[:,0]))
        for i in range(len(RcRatings_arr)):
            row = RcRatings_arr[i].tolist()
            uId = int(row[0])
            mId = int(row[1])
            if (mId not in self.movie_users):
                    self.movie_users[mId] = []
            self.movie_users[mId].append((uId, row[2]))

        movie_user = {}
        for i in sorted(self.movie_users.keys()):
            movie_user[i] = self.movie_users[i]

        howManyRatings = 0
        for film in movie_user:
            howManyRatings += len(movie_user[film])
        print(howManyRatings, " ratings")



        Xlist = []
        flag1 = True
        matches = 0
        self.matrix_users = {}
        self.matrix_usersr = {}
        self.matrix_movies = {}
        self.matrix_moviesr = {}
        im = 0
        iu = 0
        for movie in movie_user:
            row = []
            self.matrix_moviesr[movie] = im
            self.matrix_movies[im] = movie
            im += 1
            if im % 100 == 0:
                print('\rGenerating matrix %d/%d' % (im, 9066), end="")
            for user in self.users_arr[:, 0]:
                if flag1:
                    self.matrix_users[iu] = user
                    self.matrix_usersr[user] = iu
                    iu += 1
                flg = True
                for usr, rting in movie_user[movie]:
                    if int(usr) == int(user):
                        row.append(rting)
                        matches += 1
                        flg = False
                        break
                if flg:
                    row.append(0)
            flag1 = False
            #Xlist.append(row)
            Xlist.append(np.array(row))
        self.matriX = np.array(Xlist)
        ##cnt = 0
        print("                               ")
        if matches == 100004:
            print("Matrix generated")
        self.xdict = {}
        for i in range(len(self.matriX)):
            self.xdict[self.matrix_movies[i]] = self.matriX[i].tolist()

    def getSample(self, m, n, rcM, rcU, uId):
        indexUsers = {}
        indexMovies = {}
        unwatched = {}
        ##movie sample                               m
        ##user sample                                n
        ##min amount of ratings should movie have    rcM
        ##min amount that user rated                 rcU
        Xsample = []
        df_users_over_rcU = self.df_users[self.df_users['contributions'] >= rcU]
        df_movies_over_rcM = self.df_TRc[self.df_TRc['ratingCount'] >= rcM]

        temp = np.array(df_users_over_rcU['userId']).tolist()
        for i in range(0, len(temp)-1):
            if temp[i] == uId:
                del temp[i]
                break
        tempnp = np.array(temp)
        df_users_over_rcU = pd.DataFrame(tempnp, columns=['userId'])
        df_users_sample = df_users_over_rcU.sample(n=n-1, replace=False)

        df_movies_sample = df_movies_over_rcM.sample(n=m, replace=False)
        movies_sample = df_movies_sample['movieId'].to_numpy()
        users_sample = df_users_sample['userId'].to_numpy()
        users_sample = np.append(users_sample, uId)
        for mo in range(len(movies_sample)):
            row = []
            indexMovies[movies_sample[mo]] = mo
            cnt = 0
            for i in range(len(self.xdict[movies_sample[mo]])):
                if self.matrix_users[i] in users_sample:
                    cnt += 1
                    rating = self.xdict[movies_sample[mo]][i]
                    indexUsers[self.matrix_users[i]] = cnt
                    if rating == 0 and self.matrix_users[i] == uId:
                        unwatched[mo] = movies_sample[mo]
                    row.append(rating)
            Xsample.append(np.array(row))
        return np.array(Xsample), indexMovies, indexUsers, unwatched

    def getHandW(self, X, H, W, K, steps=1000, alpha=0.0002, beta=0.02):
        stepsForPercent = steps / 100
        count = 0
        for step in range(steps):
            if step % stepsForPercent == 0:
                count += 1
                print("\rSearching... ", count, "%", end="")
            for i in range(X.shape[0]):
                for j in range(X.shape[1]):
                    if X[i, j] > 0:
                        # calculate error
                        error = X[i, j] - np.dot(H[i,:],W[:,j])

                        for k in range(K):
                            # calculate gradient with a and beta parameter
                            H[i, k] = H[i, k] + alpha * (2 * error * W[k, j] - beta * H[i, k])
                            W[k, j] = W[k, j] + alpha * (2 * error * H[i, k] - beta * W[k, j])
            e = 0
            for i in range(len(X)):
                for j in range(len(X[i])):
                    if X[i, j] > 0:
                        e = e + pow(X[i, j] - np.dot(H[i,:],W[:,j]), 2)
                        for k in range(K):
                            e = e + (beta/2) * (pow(H[i, k],2) + pow(W[k, j],2))
            if e < 0.001:
                break
        return H, W

    def recommendToUser(self, uId, sampleMovies, sampleUsers, rcM, rcU, accuracy):
        K = int(accuracy)
        X, movies, users, unwatched =  self.getSample(sampleMovies, sampleUsers, rcM, rcU, uId)
        X = X.T
        n, m = X.shape
        H = np.random.rand(n,K)
        W = np.random.rand(K,m)
        nH, nW = self.getHandW(X, H, W, K)
        predictedXt = nH.dot(nW)
        print("")


        #############################
        #    movie movie movie movie#
        #user                       #
        #user                       #
        #user                       #
        #user                       #
        #user                       #
        #############################

        unwatched2 = {}
        for i in range(len(predictedXt[users[uId]])):
            if i in unwatched:
                unwatched2[predictedXt[users[uId]][i]] = unwatched[i]
        return unwatched2


    def get_recomendations(self, uId, nor, genre, reference, accuracy, option):
        numOfRec = int(nor)
        unsorted = self.recommendToUser(uId, 100, 100, 100, 100, accuracy)
        sorted_x = []
        if option == 1:
            sorted_x = sorted(unsorted.keys(), reverse=True)


        if option == 3:
            sorted_keys = sorted(unsorted.keys(), reverse=True)
            for i in range(len(sorted_keys)):
                if genre in self.movie_genres[unsorted[sorted_keys[i]]]:
                    sorted_x.append(sorted_keys[i])

        if option == 4:
            movieId_score = {}
            sorted_keys = sorted(unsorted.keys(), reverse=True)
            for i in range(len(sorted_keys)):
                movieId_score[unsorted[sorted_keys[i]]] = i
                for ref in self.movie_references[unsorted[sorted_keys[i]]]:
                    if reference in ref:
                        movieId_score[unsorted[sorted_keys[i]]] += 1
            {k: v for k, v in sorted(movieId_score.items(), key=lambda item: item[1])}
            count = 0
            for i in movieId_score:
                count += 1
                if count > numOfRec:
                    break
                print(self.mt[i])

        count = 0
        for i in sorted_x:
            count += 1
            if count > numOfRec:
                break
            print(self.mt[unsorted[i]])
        



class UserInterface:
    def __init__(self):
        self.mr = MovieRecommender()
        self.user_password = {}
        for i in range(self.mr.users_arr.shape[0]):
            self.user_password[self.mr.users_arr[i, 0]] = ("NA", "NA")

        takenIds = set(list(self.user_password.keys()))
        allIds = set()
        for i in range(1, 9999):
            allIds.add(i)
        self.freeIds = allIds - takenIds

        for i in range(self.mr.users_arr.shape[0]):
            self.user_password[self.mr.users_arr[i, 0]] = ("NA", "NA")

        self.user_watched_movies = {}
        for i in range(self.mr.users_arr.shape[0]):
            self.user_watched_movies[self.mr.users_arr[i, 0]] = []
        movieCount= 0
        for row in self.mr.matriX:
            for r in range(len(row)):
                if row[r] != 0:
                    self.user_watched_movies[int(self.mr.matrix_users[r])].append(self.mr.matrix_movies[movieCount])
            movieCount += 1

    def startInterface(self):
        print("-----------------------------------------------------")
        print("         Welcome to the MovieRecommender!")
        print("-----------------------------------------------------")
        print("")
        print("press 1. Login")
        print("press 2. Register")
        answer = input()
        if answer == "1":
            self.logIn()
        if answer == "2":
            print("type your username")
            username = input()
            print("type your password")
            password = input()
            self.addUser(username, password)


    def insertWatchedMovies(self, mIds_ratings, user):
        for mId, rating in mIds_ratings:
            self.matriX[self.matrix_moviesr[mId], self.matrix_usersr[user]]= rating

    def home(self, userId):
        print("                                                     ")
        print("options:")
        print("-----------------------------------------------------")
        print("press 1 to get recommendations")
        print("press 2 to get your watched movies")
        print("press 3 to recommend by genre")
        print("press 4 to recommend by input")
        print("press l to log out")
        print("press d to delete account")
        print("press q to quit")
        print("-----------------------------------------------------")
        option = input("option:")
        if option == "1":
            print ("input number of recommendations you want:")
            numOfRec = input()
            print("insert acuracy 1-10 (number of features for matrix factorization) higher takes longer")
            answer = input()
            accuracy = int(answer)
            self.mr.get_recomendations(userId, numOfRec, "", "", accuracy, 1)
            self.home(userId)
        if option == "2":
            for movie in self.user_watched_movies[userId]:
                print(self.mr.movie_titlesDict[movie])
            self.home(userId)
        if option == "3":
            print ("input number of recommendations you want:")
            numOfRec = input()
            print("insert acuracy 1-10 (number of features for matrix factorization) higher takes longer")
            answer = input()
            accuracy = int(answer)
            print("enter genre")
            genre = input()
            genre = genre.lower()
            self.mr.get_recomendations(userId, numOfRec, genre, "", accuracy, 3)
            self.home(userId)
        if option == "4":
            print ("input number of recommendations you want:")
            numOfRec = input()
            print("insert acuracy 1-10 (number of features for matrix factorization) higher takes longer")
            answer = input()
            accuracy = int(answer)
            print("enter your reference")
            reference = input()
            reference = reference.lower()
            self.mr.get_recomendations(userId, numOfRec, "", reference, accuracy, 4)
            self.home(userId)
        if option == "l":
            self.logOut()
        if option == "d":
            self.deleteAccount(userId)

        if option == "q":
                    print("bye")
    def logIn(self):
        print("To log in, enter userId and password")
        userIdinp = input("UserId: ")
        userId = int(userIdinp)
        password = input("Passwrord: ")
        if userId in self.user_password:
            if self.user_password[userId][1] == password:
                print("wellcome back", self.user_password[userId][0], "your id is", userId)
                print("-----------------------------------------------------")
                self.home(userId)
            else:
                print("wrong password")
                self.logIn()
        else:
            print("user not found, would you like to register? (y/n)")
            choice = input()
            if choice == "y":
                print("Sign in: enter user name and password")
                userName = input("User name: ")
                password = input("Passwrord: ")
                self.addUser(userName, password)
            else:
                self.startInterface()

    def logOut(self):
        self.startInterface()

    def addUser(self, userName, password):
        newId = self.freeIds.pop()
        self.user_password[newId] = (userName, password)
        print(self.user_password[newId])
        self.mr.users_arr.tolist().append((newId, 0))
        for row in self.mr.matriX:
            row.tolist().append(0)
        print("account created succesfuly")
        print("your id is", newId)
        print("would you like to log in? (y/n)")
        answer = input()
        if answer == "y":
                self.logIn()
        else:
            print("see you later")

    def deleteAccount(self, userId):
        print("are you sure you want to delete", self.user_password[userId][0], "? (y/n)")
        answer = input()
        if answer == "y":
            for row in self.mr.matriX:
                row[self.mr.matrix_usersr[userId]] = 0
            self.user_password[userId] = ("NA", "NA")
            self.freeIds.add(userId)
            print("account deleted")
        else:
            print("deletion aborted")


interface = UserInterface()
interface.startInterface()