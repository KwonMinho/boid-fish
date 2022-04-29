var MAX_ANGLE = 360;
var MIN_ANGLE = 0;
var CURRENT_FISH_SRC = './resource/blowfish.svg';
var Boid = /** @class */ (function () {
    function Boid(x, y, width, height, ctx) {
        var rand = Math.random() * (MAX_ANGLE - MIN_ANGLE + 1) + MAX_ANGLE;
        var angle = Math.floor(rand);
        this.velocity = new PVector(Math.cos(angle), Math.sin(angle));
        this.position = new PVector(x, y);
        this.acceleration = new PVector(0, 0);
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }
    Boid.prototype.run = function (boids) {
        this.flock(boids);
        this.update();
        // this.border();
        this.render();
    };
    // Accumulate a new acceleration each time based on three rules
    Boid.prototype.flock = function (boids) {
        var sep = this.sperate(boids);
        var ali = this.align(boids);
        var coh = this.cohesion(boids);
        sep.multiply(1.5);
        ali.multiply(1.0);
        coh.multiply(1.0);
        this.applyForce(sep); // 가속도에 끼칠 영향도(weight)
        this.applyForce(ali); // 가속도에 끼칠 영향도(weight)
        this.applyForce(coh); // 가속도에 끼칠 영향도(weight)
    };
    // Update position
    Boid.prototype.update = function () {
        // 속도 계산 (가속 추가)
        this.velocity.add(this.acceleration);
        // 속도 limit
        this.velocity.limit(Boid.maxSpeed);
        this.position.add(this.velocity);
        // 가속 초기화
        this.acceleration.multiply(0);
    };
    // 화면 밖에 벗어나면 반대편으로 랜더링
    Boid.prototype.border = function () {
        var r = 2;
        if (this.position.x < -r)
            this.position.x = this.width + r;
        if (this.position.y < -r)
            this.position.y = this.height + r;
        if (this.position.x > this.width + r)
            this.position.x = -r;
        if (this.position.y > this.height + r)
            this.position.y = -r;
    };
    Boid.prototype.render = function () {
        var fishImg = new Image();
        fishImg.src = CURRENT_FISH_SRC;
        this.ctx.drawImage(fishImg, this.position.x, this.position.y);
    };
    Boid.prototype.applyForce = function (force) {
        this.acceleration.add(force);
    };
    ////////////////////////////////////////////////////////////////
    // 분리하다
    // 1. 주변 보이드들과의 거리를 검사해서
    // 2. desiredSpearation보다 가까운 보이드와 거리르 정규화해서 평균
    Boid.prototype.sperate = function (boids) {
        var mean = new PVector();
        var count = 0;
        for (var _i = 0, boids_1 = boids; _i < boids_1.length; _i++) {
            var other = boids_1[_i];
            var distance = this.position.distance(other.position);
            if ((distance > 0) && (distance < Boid.desiredSeparation)) {
                var diff = this.position.subtract(other.position);
                diff.normalize();
                diff.divide(distance);
                mean.add(diff);
                count++;
            }
        }
        if (count > 0) {
            mean.divide(count);
        }
        // 제외해도 됨
        if (mean.magnitude() > 0) {
            mean.normalize();
            mean.multiply(Boid.maxSpeed);
            mean.subtract(this.velocity);
            mean.limit(Boid.maxForce);
        }
        return mean;
    };
    // 정렬하다
    // 주변의 보이드와 같은 속도를 가지려는 특성
    // 응집과 기본 로직은 비슷
    // 단, 위치의 평균이 아니라 속도의 평균인 점이 다르다.
    Boid.prototype.align = function (boids) {
        var mean = new PVector(0, 0);
        var count = 0;
        for (var _i = 0, boids_2 = boids; _i < boids_2.length; _i++) {
            var other = boids_2[_i];
            // 개체 간의 거리계산
            var distance = this.position.distance(other.position);
            if ((distance > 0) && (distance < Boid.neighbourRadius)) {
                mean.add(other.velocity); // 응집과 다른점
                count++;
            }
        }
        if (count > 0) {
            mean.divide(count);
            mean.normalize(); //제외가능
            mean.multiply(Boid.maxSpeed); // 정규화 (제외가능)
            var steer = mean.subtract(this.velocity); //제외가능
            steer.limit(Boid.maxForce);
            return steer;
        }
        else {
            return new PVector(0, 0);
        }
    };
    // 무리를 지으려는 성질
    // 자신을 제외한 모든 보이드의 위치 평균 값 리턴
    // 보이드의 방향을 자연스럽게 틀어주는 역할 (일종의 보정)
    Boid.prototype.cohesion = function (boids) {
        var sum = new PVector(0, 0);
        var count = 0;
        // 1. 개체간의 거리계산
        // 2. 개체 간의 거리가 neighbourRadius보다 작으면, sum 벡터 누적
        for (var _i = 0, boids_3 = boids; _i < boids_3.length; _i++) {
            var other = boids_3[_i];
            var distance = this.position.distance(other.position);
            if ((distance > 0) && (distance < Boid.neighbourRadius)) {
                sum.add(other.position);
                count++;
            }
        }
        if (count > 0) {
            sum.divide(count); // sum의 평균 구하기
            return this.seek(sum);
        }
        else {
            return new PVector(0, 0);
        }
    };
    // 현재 위치와 갈 곳을 계산해서 보이드의 방향을 계산해주는 메서드
    Boid.prototype.seek = function (target) {
        // 현재 위치에서 가려하는 곳을 가리키는 벡터
        var desired = target.subtract(this.position);
        if (desired.magnitude() > 0) {
            desired.normalize();
            desired.multiply(Boid.maxSpeed); // 원하는 벡터의 크기를 계산
            // Steering = Desired minus Velocity
            var steer = desired.subtract(this.velocity);
            steer.limit(Boid.maxForce); // 방향 전환 정도에 제한을 둔다.
            return steer;
        }
        else {
            return new PVector(0, 0);
        }
        // max speed로 조정하다
    };
    Boid.maxForce = 0.03; // 최대 조향력
    Boid.maxSpeed = 2; // 최대 속도
    // desiredSeparation은 neighourRadius보다 크면 안됨 (만약 크다면, 보이드는 모든 보이드를 배척하게 됨)
    Boid.desiredSeparation = 25;
    Boid.neighbourRadius = 50;
    return Boid;
}());
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
/*******************/
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;
var MONITOR_HZ = 144;
var timer = 0;
var flock = new Flock();
console.log(canvas.width, canvas.height);
for (var i = 0; i < 20; i++) {
    var randomX = ((Math.random() * (canvas.width - 0)) + canvas.width) % canvas.width;
    var randomY = ((Math.random() * (canvas.height - 0)) + canvas.height) % canvas.height;
    console.log(randomX, randomY);
    var boid = new Boid(randomX, randomY, canvas.width, canvas.height, ctx);
    flock.addBoid(boid);
}
function animation() {
    requestAnimationFrame(animation);
    timer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (timer % MONITOR_HZ === 0) {
        var randomX = ((Math.random() * (canvas.width - 0)) + canvas.width) % canvas.width;
        var randomY = ((Math.random() * (canvas.height - 0)) + canvas.height) % canvas.height;
        var boid = new Boid(randomX, randomY, canvas.width, canvas.height, ctx);
        flock.addBoid(boid);
    }
    flock.run();
}
animation();
//# sourceMappingURL=main.js.map