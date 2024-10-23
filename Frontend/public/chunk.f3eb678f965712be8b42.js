(() => {
    var e, t = {
            17512: (e, t, s) => {
                "use strict";
                var i = s(88478),
                    n = (s(38795), s(96064));
                class a {
                    constructor() {
                        this.DBKeypoints = [
                            ["nose_x", "nose_y", "left_eye_x", "left_eye_y", "right_eye_x", "right_eye_y", "left_ear_x", "left_ear_y", "right_ear_x", "right_ear_y", "left_shoulder_x", "left_shoulder_y", "right_shoulder_x", "right_shoulder_y", "left_elbow_x", "left_elbow_y", "right_elbow_x", "right_elbow_y", "left_wrist_x", "left_wrist_y", "right_wrist_x", "right_wrist_y", "left_hip_x", "left_hip_y", "right_hip_x", "right_hip_y", "left_knee_x", "left_knee_y", "right_knee_x", "right_knee_y", "left_ankle_x", "left_ankle_y", "right_ankle_x", "right_ankle_y"]
                        ]
                    }
                    addKeypoints = e => {
                        this.DBKeypoints.push(e)
                    };
                    saveToCSV = () => {
                        const e = `data:text/csv;charset=utf-8,${this.DBKeypoints.map((e=>e.join(","))).join("\n")}`,
                            t = encodeURI(e),
                            s = document.createElement("a");
                        s.setAttribute("href", t), s.setAttribute("download", "datasetX.csv"), document.body.appendChild(s), s.click(), this.DBKeypoints = [this.DBKeypoints[0]], document.body.removeChild(s)
                    }
                }
                var o = s(93202);
                class r {
                    constructor() {
                        this.model = null, this.label = [], this.stdConfig = null
                    }
                    setup = async (e, t) => {
                        this.label = e.label, this.stdConfig = t, this.model = await (0, o.FB)(e.path)
                    };
                    standarization = e => e.map(((e, t) => t % 2 == 0 ? e / this.stdConfig.width : e / this.stdConfig.height));
                    predict = async e => {
                        if (!this.model && !this.stdConfig) return null;
                        const t = (0, i.XeE)([this.standarization(e)]),
                            s = await this.model.predict(t).data();
                        return Array.from(s).map(((e, t) => ({
                            class: this.label[t],
                            confidence: e
                        })))
                    }
                }
                class l {
                    constructor(e) {
                        this.src = e.src, this.audioCtx = null, this.audioBuffer = null, this.isLoaded = !1
                    }
                    setup = async () => {
                        const e = window.AudioContext || window.webkitAudioContext;
                        this.audioCtx = new e, this.audioBuffer = await this.getFile()
                    };
                    getFile = async () => {
                        const e = await fetch(this.src);
                        if (!e.ok) throw new Error(`HTTP error${e.status}`);
                        const t = await e.arrayBuffer(),
                            s = await this.audioCtx.decodeAudioData(t);
                        return this.isLoaded = !0, s
                    };
                    play = () => {
                        if (this.audioCtx && this.audioBuffer) {
                            const e = this.audioCtx.createBufferSource();
                            e.buffer = this.audioBuffer, e.connect(this.audioCtx.destination), e.start()
                        }
                    }
                }
                class d {
                    constructor(e) {
                        this.count = 0, this.rules = null, this.ctxPose = e, this.lastStage = {}, this.nextStage = {}, this.currStage = {}, this.sumObsPoints = 0, this.obsStages = [], this.listAngles = [], this.isNewAssetsImgStages = !1, this.isPlayAudStage = !0, this.listAudStages = {}, this.audCount = new l({
                            src: "./audio/count-from-pixabay.webm"
                        }), this.audCount.setup()
                    }
                    initStage = () => {
                        this.currStage = {}, this.obsStages = [], this.sumObsPoints = 0, this.rules.nameStage.forEach(((e, t) => {
                            this.obsStages.push({
                                idStage: t,
                                nameStage: e,
                                sum: 0,
                                detail: {}
                            })
                        })), this.obsStages.push({
                            idStage: -1,
                            nameStage: "None",
                            sum: 0,
                            detail: {}
                        })
                    };
                    setup = e => {
                        this.rules = e, this.isNewAssetsImgStages = !0, this.initStage(), this.rules.nameStage.forEach(((e, t) => {
                            this.listAudStages[e] = new l({
                                src: this.rules.pathAudioStage[t]
                            }), this.listAudStages[e].setup()
                        }))
                    };
                    resetCount = () => {
                        this.count = 0
                    };
                    determineCurrStage = () => {
                        if (0 !== this.obsStages.length) {
                            const e = [...this.obsStages].sort(((e, t) => t.sum - e.sum)),
                                t = e[0].sum === this.sumObsPoints ? "FULL" : "PARTIAL";
                            if (this.currStage = {
                                    statusStage: t,
                                    idStage: e[0].idStage,
                                    nameStage: e[0].nameStage
                                }, "FULL" === t && this.currStage.nameStage !== this.lastStage.nameStage && this.currStage.idStage === this.rules.nameStage.length - 1 && (this.count += 1, this.isPlayAudStage && this.audCount.isLoaded && this.audCount.play()), "FULL" === t && "None" !== e[0].nameStage && (0 === Object.keys(this.lastStage).length || this.lastStage.nameStage !== e[0].nameStage)) {
                                this.lastStage = {
                                    idStage: e[0].idStage,
                                    nameStage: e[0].nameStage
                                };
                                const t = this.lastStage.idStage + 1 !== this.rules.nameStage.length ? this.lastStage.idStage + 1 : 0;
                                this.nextStage = {
                                    idStage: t,
                                    nameStage: this.rules.nameStage[t]
                                }
                            }
                        }
                    };
                    getAdvice = () => {
                        if (0 === Object.keys(this.nextStage).length) return "";
                        let e = "",
                            t = 1;
                        const s = this.obsStages[this.nextStage.idStage].detail;
                        return this.obsStages.forEach((i => {
                            i.nameStage !== this.nextStage.nameStage && Object.keys(i.detail).forEach((n => {
                                if (n in s) return;
                                1 === t && (e += `<p>To move ${this.nextStage.nameStage} :</p>`);
                                const {
                                    rangeAngle: a
                                } = this.rules.anglePoint[n];
                                e += `<p>${t}) Angle <b>${i.detail[n].name.split("_").map((e=>e.charAt(0).toUpperCase()+e.substr(1))).join(" ")}</b> (${i.detail[n].angle}°) must between ${a[this.nextStage.idStage].min}° and ${a[this.nextStage.idStage].max}°</p>`, t += 1
                            }))
                        })), e
                    };
                    detectAnglesAndStages = (e, t) => {
                        this.rules && this.ctxPose && t === this.rules.nameWorkout && (e.forEach(((t, s) => {
                            if (!(s in this.rules.anglePoint)) return;
                            const {
                                spouseIdx: i,
                                rangeAngle: n
                            } = this.rules.anglePoint[s], a = e[i[0]], o = e[i[1]];
                            let r = Math.atan2(a.y - t.y, a.x - t.x),
                                l = Math.atan2(o.y - t.y, o.x - t.x),
                                d = parseInt((l - r) / Math.PI * 180 + 360, 10) % 360;
                            this.ctxPose.moveTo(t.x, t.y), d > 180 && (d = 360 - d, [r, l] = [l, r]), this.ctxPose.arc(t.x, t.y, 20, r, l), this.ctxPose.fill(), this.listAngles.push([d, t.x + 5, t.y]), this.sumObsPoints += 1;
                            let c = !0;
                            n.forEach(((t, i) => {
                                d >= t.min && d <= t.max && (this.obsStages[i].sum += 1, this.obsStages[i].detail[s] = {
                                    name: e[s].name,
                                    angle: d
                                }, c = !1)
                            })), c && (this.obsStages[this.obsStages.length - 1].sum += 1, this.obsStages[this.obsStages.length - 1].detail[s] = {
                                name: e[s].name,
                                angle: d
                            })
                        })), this.determineCurrStage())
                    }
                }
                class c {
                    constructor(e, t = "user") {
                        this._webcamElement = e, this._addVideoConfig = {}, this._facingMode = t, this._webcamList = [], this._streamList = [], this._selectedDeviceId = ""
                    }
                    get facingMode() {
                        return this._facingMode
                    }
                    set facingMode(e) {
                        this._facingMode = e
                    }
                    get webcamList() {
                        return this._webcamList
                    }
                    get webcamCount() {
                        return this._webcamList.length
                    }
                    get selectedDeviceId() {
                        return this._selectedDeviceId
                    }
                    getVideoInputs(e) {
                        return this._webcamList = [], e.forEach((e => {
                            "videoinput" === e.kind && this._webcamList.push(e)
                        })), 1 === this._webcamList.length && (this._facingMode = "user"), this._webcamList
                    }
                    getMediaConstraints() {
                        let e = {};
                        return "" === this._selectedDeviceId ? e.facingMode = this._facingMode : e.deviceId = {
                            exact: this._selectedDeviceId
                        }, e = {
                            ...e,
                            ...this._addVideoConfig
                        }, {
                            video: e,
                            audio: !1
                        }
                    }
                    selectCamera() {
                        for (const e of this._webcamList)
                            if ("user" === this._facingMode && e.label.toLowerCase().includes("front") || "environment" === this._facingMode && e.label.toLowerCase().includes("back")) {
                                this._selectedDeviceId = e.deviceId;
                                break
                            }
                    }
                    flip(e) {
                        this._facingMode = e, "user" === this._facingMode ? this._webcamElement.style.transform = "scale(-1,1)" : this._webcamElement.style.transform = "", this.selectCamera()
                    }
                    async start(e = !0) {
                        return new Promise(((t, s) => {
                            this.stop(), navigator.mediaDevices.getUserMedia(this.getMediaConstraints()).then((i => {
                                this._streamList.push(i), this.info().then((() => {
                                    this.selectCamera(), e ? this.stream().then((() => {
                                        t(this._facingMode)
                                    })).catch((e => {
                                        s(e)
                                    })) : t(this._selectedDeviceId)
                                })).catch((e => {
                                    s(e)
                                }))
                            })).catch((e => {
                                s(e)
                            }))
                        }))
                    }
                    async info() {
                        return new Promise(((e, t) => {
                            navigator.mediaDevices.enumerateDevices().then((t => {
                                this.getVideoInputs(t), e(this._webcamList)
                            })).catch((e => {
                                t(e)
                            }))
                        }))
                    }
                    async stream() {
                        return new Promise(((e, t) => {
                            navigator.mediaDevices.getUserMedia(this.getMediaConstraints()).then((t => {
                                this._streamList.push(t), this._webcamElement.srcObject = t, "user" === this._facingMode && (this._webcamElement.style.transform = "scale(-1,1)"), this._webcamElement.play(), e(this._facingMode)
                            })).catch((e => {
                                console.log(e), t(e)
                            }))
                        }))
                    }
                    stop() {
                        this._streamList.forEach((e => {
                            e.getTracks().forEach((e => {
                                e.stop()
                            }))
                        }))
                    }
                }
                class u {
                    constructor(e, t) {
                        this.DBHandler = new a, this.isExtractKeypoints = !1, this.camHandler = new c(e), this.isVideoMode = !1, this.scaler = null, this.classifier = new r, this.isClassify = !0, this.currClass = "", this.frameClassify = 6, this.frame = 0, this.fps = 0, this.times = [], this.isLoop = !1, this.additionalElem = {}, this.webcamElem = e, this.cnvPoseElem = t, this.ctxPose = this.cnvPoseElem.getContext ? this.cnvPoseElem.getContext("2d") : null, this.nameModel = "", this.model = null, this.detector = null, this.detectorConfig = {}, this.estimationConfig = {}, this.tresholdPoints = .3, this.lines = {
                            0: [
                                [0, 1],
                                [0, 2]
                            ],
                            1: [
                                [1, 3]
                            ],
                            2: [
                                [2, 4]
                            ],
                            3: [],
                            4: [],
                            5: [
                                [5, 7],
                                [5, 6],
                                [5, 11]
                            ],
                            6: [
                                [6, 8],
                                [6, 12]
                            ],
                            7: [
                                [7, 9]
                            ],
                            8: [
                                [8, 10]
                            ],
                            9: [],
                            10: [],
                            11: [
                                [11, 12],
                                [11, 13]
                            ],
                            12: [
                                [12, 14]
                            ],
                            13: [
                                [13, 15]
                            ],
                            14: [
                                [14, 16]
                            ],
                            15: [],
                            16: []
                        }, this.counter = new d(this.ctxPose), this.isShowAdvice = !1, this.isShowDirectionSign = !0, this.tmpStage = ""
                    }
                    setup = async e => {
                        this.estimationConfig = e.estimationConfig, this.nameModel === e.model && JSON.stringify(this.detectorConfig) === JSON.stringify(e.detectorConfig) || (this.nameModel = e.model, this.model = n.oV[this.nameModel], this.detectorConfig = e.detectorConfig, this.detector = await n.cH(this.model, this.detectorConfig))
                    };
                    getPose = async () => this.detector.estimatePoses(this.webcamElem, this.estimationConfig);
                    drawSkeleton = e => {
                        if (!this.ctxPose) return null;
                        this.ctxPose.clearRect(0, 0, this.cnvPoseElem.width, this.cnvPoseElem.height), this.ctxPose.save(), this.ctxPose.beginPath(), "user" === this.camHandler._facingMode && (this.ctxPose.translate(this.cnvPoseElem.width, 0), this.ctxPose.scale(-1, 1)), this.scaler && this.ctxPose.scale(this.scaler.w, this.scaler.h), this.ctxPose.fillStyle = "#eab308", this.counter.initStage(), this.counter.detectAnglesAndStages(e, this.currClass), this.ctxPose.stroke(), this.ctxPose.fill(), this.ctxPose.beginPath(), this.ctxPose.fillStyle = "rgba(45,253,255,255)", this.ctxPose.strokeStyle = "black";
                        const t = [];
                        return e.forEach(((s, i) => {
                            t.push(s.x, s.y), s.score > this.tresholdPoints && (this.ctxPose.moveTo(s.x, s.y), this.ctxPose.arc(s.x, s.y, 5, 0, 2 * Math.PI), this.lines[i].forEach((t => {
                                e[t[1]].score > this.tresholdPoints && (this.ctxPose.moveTo(s.x, s.y), this.ctxPose.lineTo(e[t[1]].x, e[t[1]].y))
                            })))
                        })), this.isExtractKeypoints && this.DBHandler.addKeypoints(t), this.ctxPose.stroke(), this.ctxPose.fill(), this.ctxPose.strokeStyle = "white", this.counter.listAngles.forEach((e => {
                            this.ctxPose.strokeText(`${e[0]}°`, e[1], e[2])
                        })), this.counter.listAngles = [], this.ctxPose.restore(), t
                    };
                    drawPose = () => {
                        this.getPose().then((e => {
                            if (e && 0 !== e.length) {
                                const t = this.drawSkeleton(e[0].keypoints);
                                t && this.isClassify && this.additionalElem.confidenceElem && this.frame % this.frameClassify == 0 && this.classifier.predict(t).then((e => {
                                    this.currClass = e[0].confidence > e[1].confidence ? e[0].class : e[1].class, this.additionalElem.confidenceElem.style.clipPath = `inset(${100*(1-e[1].confidence.toFixed(6))}% 0 0 0)`
                                }))
                            }
                            if (this.isClassify) {
                                if (this.additionalElem.countElem && (this.additionalElem.countElem.innerText = this.counter.count), this.isShowDirectionSign && this.additionalElem.imgDirectionSignElem && 0 !== Object.keys(this.counter.nextStage).length && this.tmpStage !== this.counter.nextStage.nameStage) {
                                    if (this.tmpStage = this.counter.nextStage.nameStage, this.counter.isNewAssetsImgStages) {
                                        this.counter.isNewAssetsImgStages = !1;
                                        let e = "";
                                        this.counter.rules.pathImageStage.forEach((t => {
                                            e += `<img\n                class="animate-bounce"\n                style="width: 56px; display: none"\n                src="${t}"\n                alt="Direction Sign"\n              />`
                                        })), this.additionalElem.imgDirectionSignElem.innerHTML = e
                                    }
                                    this.additionalElem.imgDirectionSignElem.style.display = this.counter.nextStage.nameStage ? "block" : "none", this.additionalElem.imgDirectionSignElem.children[this.counter.lastStage.idStage].style.display = "none", this.additionalElem.imgDirectionSignElem.children[this.counter.nextStage.idStage].style.display = "block", this.counter.isPlayAudStage && this.counter.listAudStages[this.counter.nextStage.nameStage].isLoaded && this.counter.listAudStages[this.counter.nextStage.nameStage].play()
                                }
                                if (this.isShowAdvice && this.additionalElem.adviceWrapElem) {
                                    const e = this.counter.getAdvice();
                                    this.additionalElem.adviceWrapElem.style.display = e ? "flex" : "none", this.additionalElem.adviceWrapElem.children[0].innerText = "Advice each frame", this.additionalElem.adviceWrapElem.children[1].innerHTML = e
                                }
                            }
                            if (this.isLoop && window.requestAnimationFrame(this.drawPose), this.additionalElem.fpsElem) {
                                const e = performance.now();
                                for (; this.times.length > 0 && this.times[0] <= e - 1e3;) this.times.shift();
                                this.times.push(e), this.fps = this.times.length - 1, this.frame += 1, this.fps < 15 ? this.frameClassify = Math.ceil(this.fps / 3) : this.fps >= 15 && this.fps < 30 ? this.frameClassify = Math.floor(this.fps / 5) : this.fps >= 30 && this.fps < 45 ? this.frameClassify = Math.floor(this.fps / 7) : this.frameClassify = Math.floor(this.fps / 10), this.additionalElem.fpsElem.innerText = `FPS: ${this.fps}`
                            }
                        }))
                    }
                }
                class h {
                    constructor() {
                        this.currTime = 0, this.targetTime = null, this.interval = 1e3, this.duration = null, this.isPaused = !0, this.runner = null, this.type = "INC", this.firstDelayDuration = null, this.currDelayTime = 0, this.isFirstDelay = !0, this.isPlayAudTimer = !0, this.audStart = new l({
                            src: "./audio/start-from-google-translate.webm"
                        }), this.audDone = new l({
                            src: "./audio/done-from-freesound.webm"
                        }), this.listAudCounts = [new l({
                            src: "./audio/one-from-google-translate.webm"
                        }), new l({
                            src: "./audio/two-from-google-translate.webm"
                        }), new l({
                            src: "./audio/three-from-google-translate.webm"
                        })], this.audStart.setup(), this.audDone.setup(), this.listAudCounts.forEach((e => {
                            e.setup()
                        }))
                    }
                    setup = e => {
                        this.interval = e.interval, this.duration = e.duration, this.type = e.type, this.firstDelayDuration = e.firstDelayDuration, this.reset()
                    };
                    reset = () => {
                        this.isPaused = !1, this.currDelayTime = this.firstDelayDuration, this.targetTime = "INC" === this.type ? this.duration : 0, this.currTime = "INC" === this.type ? 0 : this.duration
                    };
                    start = (e, t, s, i) => {
                        this.reset(), null === this.runner && null !== this.targetTime && (this.runner = setInterval((() => {
                            this.isPaused || (this.isFirstDelay ? (this.isPlayAudTimer && 0 !== this.currDelayTime && this.listAudCounts[this.currDelayTime - 1].isLoaded && this.listAudCounts[this.currDelayTime - 1].play(), e(this.currDelayTime), 0 === this.currDelayTime && (t(), this.isFirstDelay = !1, this.isPaused = !1), this.currDelayTime -= 1) : (this.isPlayAudTimer && this.audStart.isLoaded && Math.abs(this.currTime - this.targetTime) === this.duration && this.audStart.play(), "INC" === this.type && (this.currTime += 1), "DEC" === this.type && (this.currTime -= 1), s(this.getCurrTime()), this.currTime === this.targetTime && (this.isPlayAudTimer && this.audDone.isLoaded && this.audDone.play(), i(), this.isPaused = !1, this.remove())))
                        }), this.interval))
                    };
                    resume = () => {
                        this.isPaused && (this.isPaused = !1)
                    };
                    pause = () => {
                        this.isPaused || (this.isPaused = !0)
                    };
                    remove = () => {
                        clearInterval(this.runner), this.runner = null
                    };
                    getCurrTime = () => ({
                        minutes: Math.floor(this.currTime / 60),
                        seconds: this.currTime % 60
                    })
                }
                class g {
                    constructor() {
                        this.DBWOScore = [], this.isLocalStorageAvailable = null, this.keyData = "DBWOScore", this.bestScore = {}
                    }
                    setup = e => {
                        if (this.bestScore = {}, e.nameWorkout.forEach((t => {
                                this.bestScore[t] = {}, e.duration.forEach((e => {
                                    this.bestScore[t][e] = 0
                                }))
                            })), "undefined" == typeof localStorage) return this.isLocalStorageAvailable = !1, void alert("Warning! Local storage unavailable. Please use newest browser");
                        this.isLocalStorageAvailable = !0;
                        const t = localStorage.getItem(this.keyData);
                        null !== t ? this.DBWOScore = JSON.parse(t) : this.saveToLocalStorage()
                    };
                    saveToLocalStorage = () => {
                        this.isLocalStorageAvailable && localStorage.setItem(this.keyData, JSON.stringify(this.DBWOScore))
                    };
                    addNewData = e => {
                        this.DBWOScore.push({
                            id: +new Date,
                            nameWorkout: e.nameWorkout,
                            duration: e.duration,
                            repetition: e.repetition,
                            date: (new Date).toLocaleString()
                        }), this.saveToLocalStorage()
                    };
                    getBestScoreByReps = () => 0 === Object.keys(this.bestScore).length ? {} : (this.DBWOScore.forEach((e => {
                        (0 === this.bestScore[e.nameWorkout][e.duration] || e.repetition >= this.bestScore[e.nameWorkout][e.duration]) && (this.bestScore[e.nameWorkout][e.duration] = e.repetition)
                    })), this.bestScore)
                }
                class m {
                    constructor() {
                        this.DBWOSettings = {}, this.isGetPrevSettings = !1, this.isLocalStorageAvailable = null, this.keyData = "DBWOSettings"
                    }
                    setup = (e, t) => {
                        if (0 !== Object.keys(this.DBWOSettings).length) return;
                        if ("undefined" == typeof localStorage) return void alert("Warning! Local storage unavailable. Please use newest browser");
                        this.isLocalStorageAvailable = !0;
                        const s = localStorage.getItem(this.keyData);
                        if (null !== s) {
                            const e = JSON.parse(s);
                            "None" !== e.currWorkout && (this.isGetPrevSettings = !0, this.change(e, t))
                        } else this.DBWOSettings = e, this.saveToLocalStorage()
                    };
                    saveToLocalStorage = () => {
                        this.isLocalStorageAvailable && localStorage.setItem(this.keyData, JSON.stringify(this.DBWOSettings))
                    };
                    getEffectChange = (e, t) => {
                        const s = this.DBWOSettings,
                            i = 0 === Object.keys(s).length;
                        Object.keys(t).forEach((n => {
                            "currWorkoutDuration" === n && (e.currWorkout !== s.currWorkout || e.currDuration !== s.currDuration || i && this.isGetPrevSettings) ? t[n]({
                                nameWO: {
                                    isChange: i ? e.currWorkout : e.currWorkout !== s.currWorkout,
                                    value: e.currWorkout
                                },
                                durationWO: {
                                    isChange: i ? e.currDuration : e.currDuration !== s.currDuration,
                                    value: e.currDuration
                                }
                            }) : (i && this.isGetPrevSettings || e[n] !== s[n]) && t[n](e[n])
                        }))
                    };
                    change = (e, t = {}) => {
                        const s = {
                            ...this.DBWOSettings,
                            ...e
                        };
                        this.getEffectChange(s, t), this.DBWOSettings = s, this.saveToLocalStorage()
                    }
                }
                document.addEventListener("DOMContentLoaded", (async () => {
                    let e = document.getElementById("webcamBox");
                    const t = document.getElementById("cnvPoseBox"),
                        s = document.getElementById("parentWebcamBox"),
                        i = document.getElementById("loaderBox"),
                        n = document.getElementById("fpsBox"),
                        a = document.getElementById("countBox"),
                        o = document.getElementById("timerBox"),
                        r = document.getElementById("delayBox"),
                        l = document.getElementById("pauseBtn"),
                        d = document.getElementById("resumeBtn"),
                        c = document.getElementById("accessCamBtn"),
                        y = document.getElementById("chooseWOBox"),
                        f = document.getElementById("formChooseWOBox"),
                        p = document.getElementById("accessCamBox"),
                        x = document.getElementById("titleWOBox"),
                        S = document.getElementById("confidenceBox"),
                        b = document.getElementById("resultBox"),
                        v = document.getElementById("resultRepBox"),
                        w = document.getElementById("resultTitleBox"),
                        E = document.getElementById("resultOKBtn"),
                        B = document.getElementById("uploadVideoBtn"),
                        D = document.getElementById("goWebcamBtn"),
                        k = document.getElementById("settingsBtn"),
                        L = document.getElementById("settingsBox"),
                        C = document.getElementById("saveSettingsBtn"),
                        _ = document.getElementById("cancelSettingsBtn"),
                        W = document.getElementById("segSettingsWOBtn"),
                        O = document.getElementById("segSettingsAdvBtn"),
                        P = document.getElementById("bodySettingsWOBox"),
                        I = document.getElementById("bodySettingsAdvBox"),
                        T = document.getElementById("scoresBtn"),
                        M = document.getElementById("scoresBox"),
                        A = document.getElementById("scoresOKBtn"),
                        $ = document.getElementById("segJourneyBtn"),
                        V = document.getElementById("segBestBtn"),
                        F = document.getElementById("bodyJourneyBox"),
                        j = document.getElementById("bodyBestScoreBox"),
                        N = document.getElementById("helpBox"),
                        H = document.getElementById("helpBtn"),
                        q = document.getElementById("segHowToUseBtn"),
                        K = document.getElementById("segAboutBtn"),
                        R = document.getElementById("bodyHowToUseBox"),
                        U = document.getElementById("bodyAboutBox"),
                        J = document.getElementById("helpOKBtn"),
                        G = document.getElementById("developerModeBox"),
                        z = document.getElementById("imgDirectionSignBox"),
                        X = document.getElementById("goAdviceBtn"),
                        Q = document.getElementById("adviceWrapBox"),
                        Y = document.getElementById("sliderAdviceBox"),
                        Z = document.getElementById("sliderCameraBox"),
                        ee = document.getElementById("recordKeypointsBtn"),
                        te = document.getElementById("pingRecordBox"),
                        se = document.getElementById("restartBtn");
                    let ie = !0,
                        ne = !1,
                        ae = 640,
                        oe = 360,
                        re = 0,
                        le = 0;
                    const de = new u(e, t),
                        ce = new h,
                        ue = new g,
                        he = new m;
                    de.additionalElem = {
                        fpsElem: n,
                        countElem: a,
                        adviceWrapElem: Q,
                        confidenceElem: S,
                        imgDirectionSignElem: z
                    }, de.camHandler._addVideoConfig = {
                        width: ae,
                        height: oe
                    };
                    const ge = () => {
                        re = window.innerWidth > 1280 ? 1280 : window.innerWidth, le = Math.floor(re * (9 / 16)), le > window.innerHeight && (le = window.innerHeight, re = Math.floor(le * (16 / 9))), s.setAttribute("style", `width:${re}px;height:${le}px`);
                        for (let e = 0; e < s.children.length; e += 1) {
                            const i = s.children[e];
                            "CANVAS" === i.tagName ? (t.width = re, t.height = le) : (i.style.width = `${re}px`, i.style.height = `${le}px`)
                        }
                        de.scaler = {
                            w: re / ae,
                            h: le / oe
                        }
                    };
                    ge(), window.addEventListener("resize", (() => {
                        ge()
                    }));
                    const me = (e, t) => {
                            let s = "";
                            return s += t ? '\n      <div class="mb-3">What workout do you want?</div>\n      ' : '\n      <div class="flex-1 overflow-y-auto flex flex-col items-center w-full">\n        <h1 class="font-bold text-2xl mt-3 mb-5">AI Workout Assistant</h1>\n        <div class="relative w-full flex flex-row justify-center items-center">\n          <img\n            src="./img/undraw_pilates_gpdb.svg"\n            alt="Ilustration of Workout"\n            class="w-1/2"\n          />\n          <div id="chooseHelpBtn" class="absolute top-0 bg-yellow-500 text-white font-bold py-1 px-2 rounded-lg cursor-pointer hover:bg-amber-500">Need Help ?</div>\n        </div>\n        <div class="mt-5 mb-3">What workout do you want?</div>\n      ', e.nameWorkout.forEach(((i, n) => {
                                0 === n && (s += '<fieldset class="grid grid-cols-2 gap-3 w-full">'), s += `\n        <label\n          for="${t?`settingsName${n}`:`chooseName${n}`}"\n          class="flex cursor-pointer items-center pl-4 border border-gray-200 rounded-lg"\n        >\n          <input\n            id="${t?`settingsName${n}`:`chooseName${n}`}"\n            type="radio"\n            value="${e.slugWorkout[n]}"\n            name="${t?"settingsNameWO":"chooseNameWO"}"\n            class="w-4 h-4 text-yellow-600"\n            required\n          />\n          <span class="w-full py-4 ml-2 text-sm font-medium text-gray-600"\n            >${i}</span\n          >\n        </label>\n        `, n === e.nameWorkout.length - 1 && (s += "</fieldset>")
                            })), s += `<div class="${t?"mt-3":"mt-5"} mb-3">How long?</div>`, e.duration.forEach(((i, n) => {
                                0 === n && (s += '<fieldset class="grid grid-cols-2 gap-3 w-full">'), s += `\n        <label\n          for="${t?`settingsDuration${n}`:`chooseDuration${n}`}"\n          class="flex cursor-pointer items-center pl-4 border border-gray-200 rounded-lg"\n        >\n          <input\n            id="${t?`settingsDuration${n}`:`chooseDuration${n}`}"\n            type="radio"\n            value="${i}"\n            name="${t?"settingsDurationWO":"chooseDurationWO"}"\n            class="w-4 h-4 text-yellow-600"\n            required\n          />\n          <span class="w-full py-4 ml-2 text-sm font-medium text-gray-600"\n            >${i}</span\n          >\n        </label>\n        `, n === e.duration.length - 1 && (s += "</fieldset>")
                            })), s += t ? "" : '\n        </div>\n        <button\n          id="submitWOBtn"\n          type="submit"\n          class="w-full bg-yellow-500 text-white py-2 text-xl font-bold rounded-lg mb-2 mt-5 hover:bg-amber-500"\n        >\n          Next\n        </button>\n      ', s
                        },
                        ye = async () => {
                            !e.paused && de.isLoop || (i.style.display = "flex", await de.camHandler.start().then((() => {
                                he.change({
                                    isAccessCamera: !0
                                }), i.style.display = "none", p.style.display = "none"
                            })).catch((e => {
                                console.log("Permission Denied: Webcam Access is Not Granted"), console.error(e), alert("Webcam Access is Not Granted, Try to Refresh Page")
                            })))
                        }, fe = () => {
                            const e = ce.getCurrTime();
                            o.innerHTML = `${`0${e.minutes}`.slice(-2)}:${`0${e.seconds}`.slice(-2)}`
                        }, pe = async t => {
                            await fetch(t).then((e => {
                                if (!e.ok) throw new Error(`HTTP error${e.status}`);
                                return e.json()
                            })).then((async t => {
                                de.counter.setup(t.rulesCountConfig);
                                const s = `${t.rulesCountConfig.nameWorkout} - ${he.DBWOSettings.currDuration}`;
                                x.innerText = s, w.innerText = s, ce.remove(), ce.setup({
                                    interval: 1e3,
                                    duration: de.isVideoMode ? Math.floor(e.duration) : 60 * +he.DBWOSettings.currDuration.split(" ")[0],
                                    type: "DEC",
                                    firstDelayDuration: de.isVideoMode ? 0 : 3
                                }), ce.isFirstDelay = !de.isVideoMode, fe(), await de.setup(t.poseDetectorConfig).then((() => {
                                    console.log("Detector Loaded")
                                })).catch((e => {
                                    console.error(e)
                                })), await de.classifier.setup(t.classifierConfig, {
                                    width: ae,
                                    height: oe
                                }).then((async () => {
                                    console.log("Classifier Ready to Use"), y.style.display = "none", he.DBWOSettings.isAccessCamera ? de.isVideoMode || await ye() : (i.style.display = "none", p.style.display = "flex")
                                })).catch((e => {
                                    console.error(e)
                                }))
                            })).catch((e => {
                                console.error(e)
                            }))
                        };
                    H.addEventListener("click", (() => {
                        N.style.display = "flex"
                    })), J.addEventListener("click", (() => {
                        N.style.display = "none"
                    })), q.addEventListener("click", (() => {
                        "none" === R.style.display && (U.style.display = "none", R.style.display = "flex", K.classList.remove("bg-amber-300", "text-gray-600"), K.classList.add("bg-amber-200", "text-gray-400"), q.classList.remove("bg-amber-200", "text-gray-400"), q.classList.add("bg-amber-300", "text-gray-600"))
                    })), K.addEventListener("click", (() => {
                        "none" === U.style.display && (R.style.display = "none", U.style.display = "flex", q.classList.remove("bg-amber-300", "text-gray-600"), q.classList.add("bg-amber-200", "text-gray-400"), K.classList.remove("bg-amber-200", "text-gray-400"), K.classList.add("bg-amber-300", "text-gray-600"))
                    })), se.addEventListener("click", (() => {
                        i.style.display = "flex", r.innerText = "", ce.setup({
                            interval: 1e3,
                            duration: de.isVideoMode ? Math.floor(e.duration) : 60 * +he.DBWOSettings.currDuration.split(" ")[0],
                            type: "DEC",
                            firstDelayDuration: de.isVideoMode ? 0 : 3
                        }), de.counter.resetCount(), a.innerText = "0", ce.isFirstDelay = !de.isVideoMode, de.isVideoMode && 0 !== e.currentTime && (e.currentTime = 0, e.load()), fe(), ce.pause(), e.pause(), de.isLoop = !1, ie = !0, ne = !0, de.counter.lastStage = {}, de.counter.nextStage = {}, z.style.display = "none", Q.style.display = "none", d.style.display = "flex", se.style.display = "none", l.style.display = "none", i.style.display = "none"
                    })), ee.addEventListener("click", (() => {
                        de.isExtractKeypoints = !de.isExtractKeypoints, de.isExtractKeypoints ? (te.classList.remove("bg-gray-500"), te.classList.add("bg-red-500"), te.children[0].style.display = "block") : (te.classList.remove("bg-red-500"), te.classList.add("bg-gray-500"), te.children[0].style.display = "none", de.DBHandler.saveToCSV())
                    })), T.addEventListener("click", (() => {
                        let e = "",
                            t = "";
                        const s = ue.getBestScoreByReps();
                        Object.keys(s).forEach((e => {
                            t += `\n        <div class="mb-3 text-gray-500 font-bold border-t-2 pt-1">\n          ${e}\n        </div>\n      `, Object.keys(s[e]).forEach(((i, n) => {
                                0 === n && (t += '\n            <div class="mb-3 grid grid-cols-2 gap-3 w-full">\n          '), t += `\n          <div\n            class="flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-sm"\n          >\n            <div\n              class="p-1 bg-yellow-400 text-center font-medium text-sm text-gray-500"\n            >\n              ${i}\n            </div>\n            <div class="p-1 text-center text-gray-500 font-medium text-lg">\n              ${s[e][i]}<span class="text-xs"> Reps</span>\n            </div>\n          </div>\n        `, n === Object.keys(s[e]).length - 1 && (t += "\n            </div>\n          ")
                            }))
                        })), 0 === ue.DBWOScore.length && (e += '\n      <div class="flex flex-row w-full h-full justify-center items-center">\n        <div class="flex flex-col items-center">\n          <img\n            src="./img/undraw_void_-3-ggu.svg"\n            alt="Ilustration of Void"\n            class="w-1/2"\n          />\n          <div class="p-3 text-sm text-gray-600 text-center">There are no Journey Scores. Let\'s do Workout to change that!</div>\n        </div>\n      </div>\n      '), [...ue.DBWOScore].sort(((e, t) => t.id - e.id)).forEach((t => {
                            e += `\n        <div\n          class="mb-3 w-full border-t-2 border-yellow-200 bg-white flex flex-row justify justify-between px-3 py-1.5"\n        >\n          <div class="flex flex-col items-start justify-between">\n            <div class="flex flex-row items-center">\n              <div class="text-md text-gray-600 font-semibold mr-2">\n                ${t.nameWorkout}\n              </div>\n              <div\n                class="text-xs px-1 py-0.5 bg-gray-200 rounded-lg text-gray-600 font-semibold"\n              >\n                ${t.duration}\n              </div>\n            </div>\n            <div class="text-xs">${t.date}</div>\n          </div>\n          <div class="flex flex-col items-center justify-between">\n            <div class="text-xl font-semibold text-gray-600">${t.repetition}</div>\n            <div class="text-xs">Reps</div>\n          </div>\n        </div>\n      `
                        })), F.innerHTML = e, j.innerHTML = t, M.style.display = "flex"
                    })), A.addEventListener("click", (() => {
                        M.style.display = "none"
                    })), $.addEventListener("click", (() => {
                        "none" === F.style.display && (j.style.display = "none", F.style.display = "block", V.classList.remove("bg-amber-300", "text-gray-600"), V.classList.add("bg-amber-200", "text-gray-400"), $.classList.remove("bg-amber-200", "text-gray-400"), $.classList.add("bg-amber-300", "text-gray-600"))
                    })), V.addEventListener("click", (() => {
                        "none" === j.style.display && (F.style.display = "none", j.style.display = "block", $.classList.remove("bg-amber-300", "text-gray-600"), $.classList.add("bg-amber-200", "text-gray-400"), V.classList.remove("bg-amber-200", "text-gray-400"), V.classList.add("bg-amber-300", "text-gray-600"))
                    })), W.addEventListener("click", (() => {
                        "none" === P.style.display && (I.style.display = "none", P.style.display = "block", O.classList.remove("bg-amber-300", "text-gray-600"), O.classList.add("bg-amber-200", "text-gray-400"), W.classList.remove("bg-amber-200", "text-gray-400"), W.classList.add("bg-amber-300", "text-gray-600"))
                    })), O.addEventListener("click", (() => {
                        "none" === I.style.display && (P.style.display = "none", I.style.display = "block", W.classList.remove("bg-amber-300", "text-gray-600"), W.classList.add("bg-amber-200", "text-gray-400"), O.classList.remove("bg-amber-200", "text-gray-400"), O.classList.add("bg-amber-300", "text-gray-600"))
                    })), k.addEventListener("click", (() => {
                        L.style.display = "flex", document.querySelector(`input[value="${he.DBWOSettings.currWorkout}"][name="settingsNameWO"]`).checked = !0, document.querySelector(`input[value="${he.DBWOSettings.currDuration}"][name="settingsDurationWO"]`).checked = !0, document.querySelector('input[name="settingsAEBox"]').checked = void 0 === he.DBWOSettings.isAudioEffect || he.DBWOSettings.isAudioEffect, document.querySelector('input[name="settingsFSBox"]').checked = void 0 !== he.DBWOSettings.isFullscreen && he.DBWOSettings.isFullscreen, document.querySelector('input[name="settingsFCBox"]').checked = void 0 !== he.DBWOSettings.isFlipCamera && he.DBWOSettings.isFlipCamera, document.querySelector('input[name="settingsDSBox"]').checked = void 0 === he.DBWOSettings.isDirectionSign || he.DBWOSettings.isDirectionSign, document.querySelector('input[name="settingsDMBox"]').checked = void 0 !== he.DBWOSettings.isDeveloperMode && he.DBWOSettings.isDeveloperMode
                    }));
                    const xe = {
                        currWorkoutDuration: async t => {
                            if (i.style.display = "flex", r.innerText = "", e.pause(), de.isLoop = !1, ie = !0, ne = !0, de.counter.lastStage = {}, de.counter.nextStage = {}, t.durationWO.isChange) {
                                ce.setup({
                                    interval: 1e3,
                                    duration: de.isVideoMode ? Math.floor(e.duration) : 60 * +t.durationWO.value.split(" ")[0],
                                    type: "DEC",
                                    firstDelayDuration: de.isVideoMode ? 0 : 3
                                }), fe();
                                const s = `${de.counter.rules.nameWorkout} - ${t.durationWO.value}`;
                                x.innerText = s, w.innerText = s
                            }
                            t.nameWO.isChange && await pe(`./rules/${t.nameWO.value}.json`), ce.isFirstDelay = !de.isVideoMode, de.isVideoMode && 0 !== e.currentTime && (e.currentTime = 0, e.load()), ce.pause(), z.style.display = "none", Q.style.display = "none", d.style.display = "flex", se.style.display = "none", l.style.display = "none", i.style.display = "none"
                        },
                        isAudioEffect: e => {
                            de.counter.isPlayAudStage = e, ce.isPlayAudTimer = e
                        },
                        isFullscreen: e => {
                            e && !document.fullscreenElement ? document.documentElement.requestFullscreen() : !e && document.exitFullscreen && document.fullscreenElement && document.exitFullscreen()
                        },
                        isFlipCamera: e => {
                            const t = e ? "environment" : "user";
                            de.camHandler.flip(t)
                        },
                        isDirectionSign: e => {
                            de.isShowDirectionSign = e, de.isClassify && (z.style.display = e ? "block" : "none")
                        },
                        isDeveloperMode: e => {
                            G.style.display = e ? "flex" : "none"
                        }
                    };
                    C.addEventListener("click", (() => {
                        const e = document.querySelector('input[name="settingsNameWO"]:checked').value,
                            t = document.querySelector('input[name="settingsDurationWO"]:checked').value,
                            s = document.querySelector('input[name="settingsAEBox"]').checked,
                            i = document.querySelector('input[name="settingsFSBox"]').checked,
                            n = document.querySelector('input[name="settingsFCBox"]').checked,
                            a = document.querySelector('input[name="settingsDSBox"]').checked,
                            o = document.querySelector('input[name="settingsDMBox"]').checked;
                        he.change({
                            currWorkout: e,
                            currDuration: t,
                            isAudioEffect: s,
                            isFullscreen: i,
                            isFlipCamera: n,
                            isDirectionSign: a,
                            isDeveloperMode: o
                        }, xe), L.style.display = "none"
                    })), _.addEventListener("click", (() => {
                        L.style.display = "none"
                    })), await (async e => {
                        await fetch("./mock-data/workout.json").then((e => {
                            if (!e.ok) throw new Error(`HTTP error${e.status}`);
                            return e.json()
                        })).then((async e => {
                            f.innerHTML = me(e, !1), P.innerHTML = me(e, !0), document.getElementById("chooseHelpBtn").addEventListener("click", (() => {
                                N.style.display = "flex"
                            })), ue.setup(e), he.setup(e.settingsConfig, {
                                isFlipCamera: xe.isFlipCamera,
                                isDeveloperMode: xe.isDeveloperMode
                            }), he.isGetPrevSettings && he.DBWOSettings.currWorkout && "None" !== he.DBWOSettings.currWorkout ? (i.style.display = "flex", await pe(`./rules/${he.DBWOSettings.currWorkout}.json`)) : (y.style.display = "flex", i.style.display = "none")
                        })).catch((e => {
                            console.error(e)
                        }))
                    })(), e.addEventListener("loadeddata", (() => {
                        de.isVideoMode || (de.isClassify && (de.isClassify = !1), de.isLoop = !0, Z.checked = !0, ne && (ne = !1), r.innerText = "", ce.pause(), de.counter.resetCount(), de.drawPose())
                    })), c.addEventListener("click", (async () => {
                        await ye()
                    })), f.addEventListener("submit", (async e => {
                        e.preventDefault();
                        const t = document.querySelector('input[name="chooseNameWO"]:checked').value,
                            s = document.querySelector('input[name="chooseDurationWO"]:checked').value;
                        "submitWOBtn" === e.submitter.id && (he.change({
                            currWorkout: t,
                            currDuration: s
                        }), y.style.display = "flex", i.style.display = "flex", await pe(`./rules/${t}.json`))
                    }));
                    const Se = e => {
                            r.innerText = e
                        },
                        be = () => {
                            r.innerText = ""
                        },
                        ve = e => {
                            o.innerText = `${`0${e.minutes}`.slice(-2)}:${`0${e.seconds}`.slice(-2)}`
                        },
                        we = () => {
                            de.isVideoMode || ue.addNewData({
                                id: +new Date,
                                nameWorkout: de.counter.rules.nameWorkout,
                                duration: he.DBWOSettings.currDuration,
                                repetition: de.counter.count,
                                date: (new Date).toLocaleString()
                            }), fe(), ce.isFirstDelay = !de.isVideoMode, v.innerText = de.counter.count, ce.start(Se, be, ve, we), ce.pause(), e.pause(), ie = !0, de.isLoop = !1, de.counter.resetCount(), de.counter.lastStage = {}, de.counter.nextStage = {}, b.style.display = "flex", d.style.display = "flex", se.style.display = "none", l.style.display = "none", z.style.display = "none", Q.style.display = "none"
                        };
                    E.addEventListener("click", (() => {
                        b.style.display = "none", ie && de.isVideoMode ? (e.pause(), e.currentTime = 0, e.load()) : (ce.reset(), fe())
                    })), l.addEventListener("click", (() => {
                        ce.pause(), e.pause(), de.isLoop = !1, d.style.display = "flex", se.style.display = "flex", l.style.display = "none"
                    })), d.addEventListener("click", (() => {
                        if (!ie && !e.paused && de.isLoop) return;
                        l.style.display = "flex", se.style.display = "none", d.style.display = "none";
                        const t = ie;
                        ie && (ie = !1, de.isClassify = !0, ce.start(Se, be, ve, we)), ce.resume(), de.isLoop = !0, e.play().then((() => {
                            if (!ne && t && !de.isVideoMode) return console.log("It run?"), void(ne = !0);
                            de.drawPose()
                        }))
                    })), B.addEventListener("change", (t => {
                        if (t.target.files && t.target.files[0]) {
                            de.camHandler.stop(), de.isClassify = !0, de.isLoop = !1, de.isVideoMode = !0, e.pause(), e.remove();
                            const i = document.createElement("video");
                            i.setAttribute("id", "webcamBox"), i.setAttribute("class", "bg-gray-200 z-10"), i.setAttribute("style", `width: ${re}px; height: ${le}px`), i.muted = !0, s.insertBefore(i, s.firstChild), i.setAttribute("src", URL.createObjectURL(t.target.files[0])), i.load(), i.play(), he.change({
                                isFlipCamera: !0
                            }, {
                                isFlipCamera: xe.isFlipCamera
                            }), i.addEventListener("loadeddata", (() => {
                                de.isVideoMode && (e = i, de.webcamElem = i, de.camHandler._webcamElement = i), de.counter.resetCount(), a.innerText = "0", r.innerText = "", ce.setup({
                                    interval: 1e3,
                                    duration: de.isVideoMode ? Math.floor(e.duration) : 60 * +he.DBWOSettings.currDuration.split(" ")[0],
                                    type: "DEC",
                                    firstDelayDuration: de.isVideoMode ? 0 : 3
                                }), ce.isFirstDelay = !de.isVideoMode, ce.pause(), fe(), e.pause(), de.counter.lastStage = {}, de.counter.nextStage = {}, 0 !== ae && de.isVideoMode && (oe = i.videoHeight, ae = i.videoWidth), de.scaler = {
                                    w: re / ae,
                                    h: le / oe
                                }, de.classifier.stdConfig = {
                                    width: ae,
                                    height: oe
                                }, d.style.display = "flex", se.style.display = "none", l.style.display = "none", z.style.display = "none", Q.style.display = "none", Z.checked = !de.isVideoMode
                            }))
                        }
                    })), X.addEventListener("click", (e => {
                        e.preventDefault(), de.isShowAdvice = !de.isShowAdvice, Y.checked = de.isShowAdvice, de.isClassify && (Q.style.display = de.isShowAdvice ? "flex" : "none")
                    })), D.addEventListener("click", (async e => {
                        e.preventDefault(), de.isVideoMode && (ae = 640, oe = 360, de.camHandler._addVideoConfig = {
                            width: ae,
                            height: oe
                        }, de.classifier.stdConfig = {
                            width: ae,
                            height: oe
                        }, de.isLoop = !1, ne = !0, Z.checked = !0, de.isVideoMode = !1, await de.camHandler.start())
                    }))
                }))
            },
            75410: () => {},
            48628: () => {},
            75042: () => {}
        },
        s = {};

    function i(e) {
        var n = s[e];
        if (void 0 !== n) return n.exports;
        var a = s[e] = {
            id: e,
            loaded: !1,
            exports: {}
        };
        return t[e].call(a.exports, a, a.exports, i), a.loaded = !0, a.exports
    }
    i.m = t, i.amdD = function() {
        throw new Error("define cannot be used indirect")
    }, i.amdO = {}, e = [], i.O = (t, s, n, a) => {
        if (!s) {
            var o = 1 / 0;
            for (c = 0; c < e.length; c++) {
                for (var [s, n, a] = e[c], r = !0, l = 0; l < s.length; l++)(!1 & a || o >= a) && Object.keys(i.O).every((e => i.O[e](s[l]))) ? s.splice(l--, 1) : (r = !1, a < o && (o = a));
                if (r) {
                    e.splice(c--, 1);
                    var d = n();
                    void 0 !== d && (t = d)
                }
            }
            return t
        }
        a = a || 0;
        for (var c = e.length; c > 0 && e[c - 1][2] > a; c--) e[c] = e[c - 1];
        e[c] = [s, n, a]
    }, i.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return i.d(t, {
            a: t
        }), t
    }, i.d = (e, t) => {
        for (var s in t) i.o(t, s) && !i.o(e, s) && Object.defineProperty(e, s, {
            enumerable: !0,
            get: t[s]
        })
    }, i.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), i.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, i.nmd = e => (e.paths = [], e.children || (e.children = []), e), (() => {
        var e = {
            179: 0
        };
        i.O.j = t => 0 === e[t];
        var t = (t, s) => {
                var n, a, [o, r, l] = s,
                    d = 0;
                if (o.some((t => 0 !== e[t]))) {
                    for (n in r) i.o(r, n) && (i.m[n] = r[n]);
                    if (l) var c = l(i)
                }
                for (t && t(s); d < o.length; d++) a = o[d], i.o(e, a) && e[a] && e[a][0](), e[a] = 0;
                return i.O(c)
            },
            s = self.webpackChunkai_workout_assistant = self.webpackChunkai_workout_assistant || [];
        s.forEach(t.bind(null, 0)), s.push = t.bind(null, s.push.bind(s))
    })();
    var n = i.O(void 0, [572, 50, 887, 985, 370, 320, 306, 858, 73], (() => i(17512)));
    n = i.O(n)
})();