from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt

from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django import forms


from user_page.models import UserPage, Meme
import json
# Create your views here.

def index(request):
    response = json.dumps({})
    return HttpResponse(response, content_type='text/json')

@csrf_exempt
def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        print("[" + username, password + " ]")
        new_user = User.objects.create_user(username, None, password)
        new_user.save()
        up = UserPage(user=new_user)
        up.save()
        print("user created")
        return HttpResponse("user created", status=201)


@csrf_exempt
def signin(request):
    body = json.loads(request.body.decode('utf-8'))
    try:
        user = authenticate(username=body["username"], password=["password"])
        if user is not None:
            print("[" + body["username"] + "signed in]")
            response = json.dumbps({"user": "valid"})
            return HttpResponse(response, content_type='text/json')

        else:
            print("[user not valid]")
            response = json.dumbps({"user": "not_valid"})
            return HttpResponse(response, content_type='text/json')
            
    except:
        response = json.dumps([{'Error:': 'User Name or Password incorrect!'}])
        return HttpResponse(response, content_type='text/json')

@csrf_exempt
def get_UserPage(request, user_name):
    print(user_name)
    if request.method == 'GET':
        try:
            up = UserPage.objects.get(user=User.objects.filter(username=user_name).first())
            print("[" + up.user.username + " ]")
            print(list(Meme.objects.filter(userPage=up)))
            listOfmemeObjs = list(Meme.objects.filter(userPage=up))
            listOfmemeUrls = []
            for memeObj in listOfmemeObjs:
                listOfmemeUrls.append(memeObj.imageUrl)
            response = json.dumps({"user": up.user.username, "memes": listOfmemeUrls})
        except Exception as e:
            print(e)
            response = json.dumps({'user:': 'No user with such name'})
            return HttpResponse(response, content_type='application/json', status=404)

        return HttpResponse(response, content_type='application/json')


def modify(text):
    text = text.replace('_', "__")
    text = text.replace('-', "--")
    text = text.replace('/', "~s")
    text = text.replace("  ", '/')
    text = text.replace(' ', '-')
    text = text.replace('?', "~q")
    text = text.replace('&', "~a")
    text = text.replace('%', "~p")
    text = text.replace('#', "~h")
    text = text.replace('\\', "~b")
    text = text.replace('<', "~l")
    text = text.replace('>', "~g")
    text = text.replace('"', "''")
    return str(text)

@csrf_exempt
def generate_meme(request):
    if request == None:
        response = json.dumps([{"Error": "no body"}])
        return HttpResponse(response, content_type='text/json')

    body = json.loads(request.body.decode('utf-8'))
    template = body["template"]
    text = modify(body["text"])

    imageUrl = "https://api.memegen.link/images/"
    imageUrl += template+"/"+text+".jpg"+"?layout=top"
    response = json.dumps({'meme': imageUrl})
    return HttpResponse(response, content_type='application/json')
    
@csrf_exempt
def add_meme(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        requsername = body["username"]
        reqpassword = body["password"]
        imageUrl = body["meme"]

        if (requsername is None or requsername == ""):
            response = json.dumps({"text": "empty"})
            return HttpResponse(response, content_type='application/json')

        theuser = authenticate(username=requsername, password=reqpassword)
    
        if theuser is not None:
            print("[ " + theuser.username + "signed in ]")
            response = json.dumps({"user": theuser.username, "meme": "added"})
            m = Meme(imageUrl=imageUrl, userPage=UserPage.objects.filter(user=theuser).first()) 
            print("[ Meme aded to: " + requsername + " ]")
            m.save()
            return HttpResponse(response, content_type='application/json')

        else:
            print("[ " + body["username"] + ", user not valid ]")
            response = json.dumps({"user": "not_valid"})
            print("[ user:" + requsername+ ", password:" + reqpassword +" ]")
            new_user = User.objects.create_user(requsername, None, reqpassword)
            theuser = new_user
            print("[ User: " + new_user.username + " created ]")
            new_user.save()
            up = UserPage(user=new_user)
            up.save()
            m = Meme(imageUrl=imageUrl, userPage=UserPage.objects.filter(user=new_user).first()) 
            m.save()
            print("[ Memepage for: " + requsername + " created ]")
            return HttpResponse(response, content_type='application/json')
            
        




class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password']