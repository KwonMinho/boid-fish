var PVector = /** @class */ (function () {
    function PVector(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    PVector.prototype.add = function (vec_or_scal) {
        this.addX(vec_or_scal);
        this.addY(vec_or_scal);
        return this;
    };
    PVector.prototype.addX = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.x += vec_or_scal;
        else
            this.x += vec_or_scal.x;
        return this;
    };
    PVector.prototype.addY = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.y += vec_or_scal;
        else
            this.y += vec_or_scal.y;
        return this;
    };
    PVector.prototype.addZ = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.z += vec_or_scal;
        else
            this.z += vec_or_scal.z;
        return this;
    };
    PVector.prototype.subtract = function (vec_or_scal) {
        this.subtractX(vec_or_scal);
        this.subtractY(vec_or_scal);
        this.subtractZ(vec_or_scal);
        return this;
    };
    PVector.prototype.subtractX = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.x -= vec_or_scal;
        else
            this.x -= vec_or_scal.x;
        return this;
    };
    PVector.prototype.subtractY = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.y -= vec_or_scal;
        else
            this.y -= vec_or_scal.y;
        return this;
    };
    PVector.prototype.subtractZ = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.z -= vec_or_scal;
        else
            this.z -= vec_or_scal.z;
        return this;
    };
    PVector.prototype.distance = function (vec) {
        return Math.sqrt(Math.pow(this.distanceX(vec), 2) +
            Math.pow(this.distanceY(vec), 2) +
            Math.pow(this.distanceZ(vec), 2));
    };
    PVector.prototype.distanceX = function (vec) {
        return vec.x - this.x;
    };
    PVector.prototype.distanceY = function (vec) {
        return vec.y - this.y;
    };
    PVector.prototype.distanceZ = function (vec) {
        return vec.z - this.z;
    };
    PVector.prototype.limit = function (high) {
        if (this.magnitude() > high) {
            this.normalize();
            return this.multiply(high);
        }
    };
    PVector.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    PVector.prototype.normalize = function () {
        var m = this.magnitude();
        if (m > 0)
            this.divide(Math.sqrt(m));
        return this;
    };
    PVector.prototype.divide = function (vec_or_scal) {
        this.divideX(vec_or_scal);
        this.divideY(vec_or_scal);
        this.divideZ(vec_or_scal);
        return this;
    };
    PVector.prototype.divideX = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.x /= vec_or_scal;
        else
            this.x /= vec_or_scal.x;
        return this;
    };
    PVector.prototype.divideY = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.y /= vec_or_scal;
        else
            this.y /= vec_or_scal.y;
        return this;
    };
    PVector.prototype.divideZ = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.z /= vec_or_scal;
        else
            this.z /= vec_or_scal.z;
        return this;
    };
    PVector.prototype.multiply = function (vec_or_scal) {
        this.multiplyX(vec_or_scal);
        this.multiplyY(vec_or_scal);
        this.multiplyZ(vec_or_scal);
        return this;
    };
    PVector.prototype.multiplyX = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.x *= vec_or_scal;
        else
            this.x *= vec_or_scal.x;
        return this;
    };
    PVector.prototype.multiplyY = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.y *= vec_or_scal;
        else
            this.y *= vec_or_scal.y;
        return this;
    };
    PVector.prototype.multiplyZ = function (vec_or_scal) {
        if (typeof vec_or_scal === 'number')
            this.z *= vec_or_scal;
        else
            this.z *= vec_or_scal.z;
        return this;
    };
    return PVector;
}());
export default PVector;
//# sourceMappingURL=pvector.js.map