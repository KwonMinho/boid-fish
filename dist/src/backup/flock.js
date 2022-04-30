var Flock = /** @class */ (function () {
    function Flock() {
        this.boids = new Array();
    }
    Flock.prototype.run = function () {
        var _this = this;
        this.boids.forEach(function (boid) {
            boid.run(_this.boids);
        });
    };
    Flock.prototype.addBoid = function (boid) {
        this.boids.push(boid);
    };
    return Flock;
}());
export default Flock;
//# sourceMappingURL=flock.js.map