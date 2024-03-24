export class Bernstein {

    constructor(n, k) {
        this.n = n;
        this.v = k;     //v = k
    }

    factorial(n) {
        let rezultat = 1;
        for (let i = n; i > 0; i--) {
            rezultat *= i;
        }
        return rezultat;
    }

    binom(n, k) {
        return this.factorial(n) / (this.factorial(k) * this.factorial(n-k));
    }

    value(x) {
        return this.binom(this.n, this.v) * (x**this.v) * ((1 - x)**(this.n - this.v));
    }

    derivative(x) {
        return this.n * ((this.binom((this.n-1), (this.v-1)) * (x**(this.v-1)) * ((1 - x)**((this.n-1) - (this.v-1)))) -
                         (this.binom((this.n-1), this.v) * (x**this.v) * ((1 - x)**((this.n-1) - this.v))));
    }
}