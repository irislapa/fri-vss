export class Vector {

    constructor(components) {
       this.components = components;
    }

    toArray() {
        return this.components;
    }

    length() {
        const vektor = new Vector([...this.components]);
        let res;
        for (let i = 0; i < vektor.components.length; i++) {
            res += vektor.components[i]**2;
        }
        return Math.sqrt(res);
    }

    add(v) {
        const vektor = new Vector([...this.components]);
        for (let i = 0; i < vektor.components.length; i++) {
            vektor.components[i] += v.components[i];
        }
        return vektor;
    }

    sub(v) {
        const vektor = new Vector([...this.components]);
        for (let i = 0; i < vektor.components.length; i++) {
            vektor.components[i] -= v.components[i];
        }
        return vektor;
    }

    mul(v) {
        const vektor = new Vector([...this.components]);
        for (let i = 0; i < vektor.components.length; i++) {
            vektor.components[i] *= v.components[i];
        }
        return vektor;
    }

    div(v) {
        const vektor = new Vector([...this.components]);
        for (let i = 0; i < vektor.components.length; i++) {
            vektor.components[i] /= v.components[i];
        }
        return vektor;
    }

    mulScalar(s) {
        const vektor = new Vector([...this.components]);
        for (let i = 0; i < vektor.components.length; i++) {
            vektor.components[i] *= s;
        }
        return vektor;
    }

    divScalar(s) {
        const vektor = new Vector([...this.components]);
        for (let i = 0; i < vektor.components.length; i++) {
            vektor.components[i] /= s;
        }
        return vektor;
    }
}