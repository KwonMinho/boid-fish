
class PVector {
    x: number;
    y: number;
    z: number;

    constructor(x:number|void, y:number|void, z: number|void){
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(vec_or_scal: PVector): PVector {
        this.addX(vec_or_scal);
        this.addY(vec_or_scal);
        return this;
    }

    addX(vec_or_scal: PVector|number): PVector {
        if (typeof vec_or_scal === 'number') this.x += vec_or_scal
        else this.x += vec_or_scal.x
        return this
    }

    addY(vec_or_scal: PVector|number): PVector {
        if (typeof vec_or_scal === 'number') this.y += vec_or_scal
        else this.y += vec_or_scal.y
        return this
    }

    addZ(vec_or_scal: PVector|number): PVector {
        if (typeof vec_or_scal === 'number') this.z += vec_or_scal
        else this.z += vec_or_scal.z
        return this
    }

    subtract(vec_or_scal: PVector|number): PVector {
        this.subtractX(vec_or_scal);
        this.subtractY(vec_or_scal);
        this.subtractZ(vec_or_scal);
        return this;
    }
    
    subtractX(vec_or_scal: PVector|number): PVector  {
        if (typeof vec_or_scal === 'number') this.x -= vec_or_scal
        else this.x -= vec_or_scal.x
        return this
    }

    subtractY(vec_or_scal: PVector|number): PVector  {
        if (typeof vec_or_scal === 'number') this.y -= vec_or_scal
        else this.y -= vec_or_scal.y
        return this
    }

    subtractZ(vec_or_scal: PVector|number): PVector  {
        if (typeof vec_or_scal === 'number') this.z -= vec_or_scal
        else this.z -= vec_or_scal.z
        return this
    }

    distance(vec: PVector): number {
        return Math.sqrt(
            this.distanceX(vec) ** 2 +
            this.distanceY(vec) ** 2 +
            this.distanceZ(vec) ** 2 
        );
    }

    distanceX(vec: PVector): number {
        return vec.x - this.x
    }

    distanceY(vec: PVector): number {
        return vec.y - this.y
    }

    distanceZ(vec: PVector): number {
        return vec.z - this.z
    }


    limit(high: number): PVector|void {
        if (this.magnitude() > high){
            this.normalize();
            return this.multiply(high);
        }
    }

    magnitude(): number{
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): PVector{
        const m: number = this.magnitude();
        if(m > 0)  this.divide(Math.sqrt(m));
        return this
    }

    divide(vec_or_scal: PVector | number): PVector {
        this.divideX(vec_or_scal);
        this.divideY(vec_or_scal);
        this.divideZ(vec_or_scal);
        return this;
    }

    divideX(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.x /= vec_or_scal;
        else this.x /= vec_or_scal.x;
        return this;
    }


    divideY(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.y /= vec_or_scal;
        else this.y /= vec_or_scal.y;
        return this;
    }


    divideZ(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.z /= vec_or_scal
        else this.z /= vec_or_scal.z
        return this
    }


    multiply(vec_or_scal: PVector | number): PVector{
        this.multiplyX(vec_or_scal);
        this.multiplyY(vec_or_scal);
        this.multiplyZ(vec_or_scal);
        return this;
    }

    multiplyX(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.x *= vec_or_scal;
        else this.x *= vec_or_scal.x;
        return this;
    }
    multiplyY(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.y *= vec_or_scal;
        else this.y *= vec_or_scal.y;
        return this;
    }
    multiplyZ(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.z *= vec_or_scal;
        else this.z *= vec_or_scal.z;
        return this;
    }
}


export default PVector;