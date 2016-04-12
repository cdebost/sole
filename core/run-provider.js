var Montage = require("montage/core/core").Montage,
    Run = require("model/run").Run;

// TODO: Probably not all necessary
require("core/iscroll_zoom");
require("core/tracker");
require("core/cubic");
require("core/animation");

exports.RunProvider = Montage.specialize({
    _fileService: {
        value: null
    },

    init: {
        value: function(fileService) {
            this._fileService = fileService;
            return this;
        }
    },

    /**
     * Populate the data of a given run. The run should contain an id.
     */
    loadRunData: {
        value: function(run) {
            var self = this;
            if (run.isDataLoaded && false) {
                return;
            }
            return Promise.all([
                this._loadForeData(run),
                this._loadHeelData(run)
            ]).then(function() {
                run.isDataLoaded = true;
                run.calcDate();
                self._calcSteps(run);
            });
        }
    },

    _loadForeData: {
        value: function(run) {
            var self = this;
            return this._fileService.readCSV("runs/" + run.id + "/fore.csv")
                .then(function (ret) {
                    var data = ret.split("\n");
                    for (var i = 1; i < data.length; ++i) {
                        var fields = self._normalizedFields(data[i]);
                        run.fore.push(fields);
                    }
                });
        }
    },

    _loadHeelData: {
        value: function(run) {
            var self = this;
            return this._fileService.readCSV("runs/" + run.id + "/heel.csv")
                .then(function(ret) {
                    var data = ret.split("\n");
                    for (var i = 1; i < data.length; ++i) {
                        var fields = self._normalizedFields(data[i]);
                        run.heel.push(fields);
                    }
                });
        }
    },

    _normalizedFields: {
        value: function(dataFragment) {
            var fields = dataFragment.split(",");
            for (var b = 0; b < fields.length; b++) {
                if (b !== 1 && b !== 2) {
                    fields[b] = fields[b] * 1.0;
                }
            }
            return fields;
        }
    },

    _calcSteps: {
        value: function(run) {
            var instep = 0;
            var steps_count = 0;
            var onheel = 0;

            run.steps = [];
            run.stepsm = [];
            run.tops = [];
            run.footx = [];
            run.strikes = [];
            run.prones = [];

            var last_step_time = 0;
            var steps_per_minute = 0;
            var current_time = 0;
            var t_instep = 0;
            var t_distance = 0;
            var t_foot_pos = 0;
            var t_footx = 0;
            var t_ground_pos = 0;
            var t_ground_pos2 = 0;
            var last_time = run.fore[0][0]*1000;

            for (var a = 0; a < run.fore.length; a++) {
                var heel = 0;
                if (a < run.heel.length) {
                    heel = run.heel[a][3];

                }

                var fa = (run.fore[a][4]);
                //ADJUST ANY ANGLE NOT INLINE
                if (this.smoothing) {
                    var fa1 = (a < run.fore.length-1) ? run.fore[a+1][4] : 0;
                    var fa2 = (a < run.fore.length-2) ? run.fore[a+2][4] : 0;
                    if (fa1 > fa) {
                        if (!(fa1 > fa && fa1 < fa2)) {
                            run.fore[a+1][4] = fa + (fa2 - fa)*.5;
                        }
                    } else if (fa1 < fa) {
                        if (!(fa1 < fa && fa1 > fa2)) {
                            run.fore[a+1][4] = fa + (fa2 - fa)*.5;
                        }
                    }
                }

                var fore = run.fore[a][3];
                var fore1 = (a < run.fore.length-1) ? run.fore[a+1][3] : 0;
                var fore2 = (a < run.fore.length-2) ? run.fore[a+2][3] : 0;
                var fore3 = (a < run.fore.length-3) ? run.fore[a+3][3] : 0;

                // var fa2 = (fa-128)*.7;

                if (heel > 20) fa = 88;


                if (onheel && instep && heel == 0 && fore == 0) {
                    if (fore1 > 30 || fore2 > 30 || fore3 > 30) fore = 30;
                }
                if (!instep && (heel > 30 || fore > 30)) {
                    instep = 1;
                    current_time = run.fore[a][0]*1000;
                    if (last_step_time) {
                        steps_per_minute = (1000*60)/(current_time - last_step_time)*2;
                    }
                    run.strikes[a] = isNaN(run.fore[a][4]) ? "none" : ((run.fore[a][4])-128)*.7;
                    run.prones[a] = (run.fore[a][5]);
                    last_step_time = current_time;
                    steps_count++;

                    if (heel > 30) onheel = 1;
                    else onheel = 0;
                } else if (instep && heel == 0 && fore == 0) {
                    instep = 0;
                    onheel = 0;
                    run.strikes[a] = "none";
                    run.prones[a] = "none";

                } else if (heel > 30) {
                    onheel = 1;
                    run.strikes[a] = "none";
                    run.prones[a] = "none";
                } else {
                    run.strikes[a] = "none";
                    run.prones[a] = "none";
                }


                if (fa < 260) {

                    var p = [50,60,70,80,100,110,130,145,160,170,175,155,125,105,85,70,60,50,40,35,35,40,45,55,55,55];
                    var p1 = Math.floor(fa/10.0);
                    var p2 = Math.ceil(fa/10.0);
                    var diff = fa/10.0 - p1;
                    var t = p[p1] + (p[p2] - p[p1])*diff;
                    //console.log("INDEX=" + a + " FRONT ANGLE = " + fa + " TOP= " + t);
                    run.tops[a] = t;

                }
                else {
                    //console.log("ZEROOOOOOOOOOOOO");
                    run.tops[a] = 0;
                }


                run.steps[a] = (instep ? -steps_count : steps_count);
                t_footx = run.footx[a] = (instep ? -1 : 1);

                run.stepsm[a] = steps_per_minute;
            }

            var cnt = 0,
                fronts = 0,
                fronts_cnt = 0,
                sides = 0;
            while (cnt < run.fore.length) {
                var runs = 0;

                while ((cnt+runs < run.steps.length) && run.steps[cnt+runs] < 0) {
                    runs++;
                }
                if (runs > 3) {
                    var both = 0,
                        h = 0,
                        f = 0,
                        ss = "";
                    for (var r = cnt; r < cnt + runs; r++) {
                        if (!f && (run.fore[r][3]*1.0 > 20)) f = 1;
                        if (!h && (run.heel[r][3]*1.0 > 20)) h = 1;
                        ss += "[" + run.fore[r][3] + "," + run.heel[r][3] + "]";
                    }
                    if (h && f) both = 1;
                    var index = Math.floor(cnt + (runs/2));
                    var front = (run.fore[index][4]-128)*.7;
                    var side = run.fore[index][5];
                    if (front != 0 && side != 0 && both) {
                        fronts += front;
                        sides += side;
                        fronts_cnt++;
                    }
                    cnt += runs;
                } else cnt++;
            }
            run.level_front = fronts/fronts_cnt;
            run.level_side = (sides/fronts_cnt)-128;

            var dist = Math.floor(run.fore.length/4.0);
            run.stats.ste = [];
            run.stats.ste.avg = Math.round(Math.abs(run.steps[run.fore.length-2]))*2 ;
            run.stats.ste[0] = Math.round((Math.abs(run.steps[(dist*(1))-1]) - Math.abs(run.steps[(dist*(0))])) )*2;
            run.stats.ste[1] = Math.round((Math.abs(run.steps[(dist*(2))-1]) - Math.abs(run.steps[(dist*(1))])) )*2;
            run.stats.ste[2] = Math.round((Math.abs(run.steps[(dist*(3))-1]) - Math.abs(run.steps[(dist*(2))])) )*2;
            run.stats.ste[3] = Math.round((Math.abs(run.steps[(dist*(4))-2]) - Math.abs(run.steps[(dist*(3))])) )*2;

            run.stats.spm = [];
            run.stats.spm.avg = Math.round(Math.abs(run.steps[run.fore.length-2]) / (run.fore[run.fore.length-2][0] - run.fore[0][0])*60)*2;
            run.stats.spm[0] = Math.round((Math.abs(run.steps[(dist*(1))-1]) - Math.abs(run.steps[(dist*(0))])) / (run.fore[(dist*(1))-1][0] - run.fore[(dist*(0))][0])*60)*2;
            run.stats.spm[1] = Math.round((Math.abs(run.steps[(dist*(2))-1]) - Math.abs(run.steps[(dist*(1))])) / (run.fore[(dist*(2))-1][0] - run.fore[(dist*(1))][0])*60)*2;
            run.stats.spm[2] = Math.round((Math.abs(run.steps[(dist*(3))-1]) - Math.abs(run.steps[(dist*(2))])) / (run.fore[(dist*(3))-1][0] - run.fore[(dist*(2))][0])*60)*2;
            run.stats.spm[3] = Math.round((Math.abs(run.steps[(dist*(4))-2]) - Math.abs(run.steps[(dist*(3))])) / (run.fore[(dist*(4))-2][0] - run.fore[(dist*(3))][0])*60)*2;

            function print_time(dur) {
                var min = dur;
                var sec = Math.floor((min - Math.floor(min))*60);

                return Math.floor(min) + ":" + (sec < 10 ? "0" + sec : sec);
            }

            run.stats.dur = [];
            run.stats.dur.avg = print_time((run.fore[run.fore.length-2][0] - run.fore[0][0])/(60));
            run.stats.dur[0] = print_time((run.fore[(dist*(1))-1][0] - run.fore[(dist*(0))][0])/(60));
            run.stats.dur[1] = print_time((run.fore[(dist*(2))-1][0] - run.fore[(dist*(1))][0])/(60));
            run.stats.dur[2] = print_time((run.fore[(dist*(3))-1][0] - run.fore[(dist*(2))][0])/(60));
            run.stats.dur[3] = print_time((run.fore[(dist*(4))-2][0] - run.fore[(dist*(3))][0])/(60));

            // TODO: Refactor
            // this.setCSS(".sole_slider_bottom::after","content",'"' + run.stats.dur[0] + ':00"' );
            // if (!this.left_timer) this.left_timer = this.getCSS(".sole_slider_bottom::before");

            this.start_timer = run.fore[0][0];


            var strikes = [0,0,0,0,0];
            var strikes_cnt = [0,0,0,0,0];
            var prones = [0,0,0,0,0];
            var prones_cnt = [0,0,0,0,0];

            for (var a = 0; a < 4; a++) {
                for (var f = dist*a; f < dist*a + dist; f++) {
                    var st = run.strikes[f];
                    var pr = run.prones[f];
                    // console.log("strike " + f + " " + st);
                    if (st != "none" && st != undefined) {
                        strikes[0] = strikes[0] +  st*1;
                        strikes_cnt[0] = strikes_cnt[0]+1;
                        strikes[a+1] = strikes[a+1] + st;
                        strikes_cnt[a+1] = strikes_cnt[a+1]+1;

                    }
                    if (pr != "none" && pr != undefined) {
                        prones[0] = prones[0] +  pr*1;
                        prones_cnt[0] = prones_cnt[0]+1;
                        prones[a+1] = prones[a+1] + pr;
                        prones_cnt[a+1] = prones_cnt[a+1]+1;

                    }
                }
            }

            run.stats.str = [];
            run.stats.str.avg = Math.round(strikes[0]/strikes_cnt[0]);
            run.stats.str[0] = Math.round(strikes[1]/strikes_cnt[1]);
            run.stats.str[1] = Math.round(strikes[2]/strikes_cnt[2]);
            run.stats.str[2] = Math.round(strikes[3]/strikes_cnt[3]);
            run.stats.str[3] = Math.round(strikes[4]/strikes_cnt[4]);

            run.stats.pro = [];
            run.stats.pro.avg = Math.floor(-(Math.round(prones[0]/prones_cnt[0])-128)*.3);
            run.stats.pro[0] = Math.floor(-(Math.round(prones[1]/prones_cnt[1])-128)*.3);
            run.stats.pro[1] = Math.floor(-(Math.round(prones[2]/prones_cnt[2])-128)*.3);
            run.stats.pro[2] = Math.floor(-(Math.round(prones[3]/prones_cnt[3])-128)*.3);
            run.stats.pro[3] = Math.floor(-(Math.round(prones[4]/prones_cnt[4])-128)*.3);


            //PAD THE PRESSURE SENSITIVITY BY EXTENDING FOOT DOWN BY ONE FRAME
            var cnt = 0;
            var up = 0;
            while (cnt < run.footx.length) {
                if (cnt && (run.footx[cnt] == -1) && (run.footx[cnt-1] == 1)) run.footx[cnt-1] = -1;
                if (0 && (cnt < run.footx.length-1) && (run.footx[cnt] == -1) && (run.footx[cnt+1] == 1)){
                    //      run.footx[cnt+1] = -1;
                    //      cnt += 2;
                } else cnt++;
            }

            //CALC THE RETURN FOOT DISTANCE PERCENTAGES
            var down = 0;
            var cnt = 0;
            var up = 0;


            while (cnt < run.footx.length) {
                if (run.footx[cnt] < 0) {
                    down++;
                    cnt++;
                    up = 0;
                } else {
                    while(run.footx[cnt + up] > 0) {
                        up++;
                    }
                    var sum = 0;
                    while(run.footx[cnt] > 0) {
                        //run.footx[cnt] = down*1.0/up;
                        sum = sum + 1/up;
                        run.footx[cnt] = sum;
                        cnt++;
                    }
                    down = 0;
                }
            }

            var t_percs = [];
            // console.log("TRACKER = " + this.footx);

            for (var a = 0; a < run.fore.length; a++) {
                var foot_a1 = run.footx[a];
                var foot_a2 = a < run.fore.length-1 ? run.footx[a+1] : run.footx[a];
                var fa = (run.fore[a][4]);

                var d = run.fore[a][0]*1000;
                var spm =  run.stepsm[a]/1.5;//HERE

                var delta = Math.floor((d - last_time)*(spm/220*1.5));// * (spm > 150 ? (spm/150.0)*2 : 1.0);
                t_ground_pos +=  delta;
                t_ground_pos2 +=  delta;

                var top = run.tops[a];
                var f1 = fa;
                var p2 = heel;
                var strike = 0;
                if (run.strikes[a] && run.strikes[a] != "none") strike = run.strikes[a];
                var prone = 0;
                if (run.prones[a] && run.prones[a] != "none") prone = run.prones[a];

                if (foot_a1 == -1) {
                    if (!t_instep) {
                        t_distance = 0;
                        t_dist = 0;
                        t_foot_pos = 0;
                        t_instep = 1;
                    }
                    t_foot_pos += delta;
                    //	console.log(a + " --> " + t_foot_pos + " top = " + top);



                } else {
                    var cnt = 0;
                    while (run.footx[a+cnt] >= 0) cnt++;
                    if (t_instep) {
                        t_distance = t_foot_pos;
                        t_dist = t_foot_pos;
                        t_perc = 1/(cnt+1);
                        var tot = 0;
                        for (var p = 1; p < cnt+1; p++) {
                            t_percs.push(AnimationEasing.Quartic.InOut(p*t_perc));
                        }
                        t_instep = 0;
                    }

                    var retperc = foot_a1;//(foot_a1 + (foot_a2 - foot_a1)*(perc));
                    if (retperc < 0) retperc = 0;
                    else if (retperc > 1) retperc = 1.0;

                    top = run.tops[a] -  CUB.calcIntersectionAt(retperc)*(200*spm/220)*2;
                    t_foot_pos = Math.floor((t_percs[t_percs.length-1]*t_distance));//(foot_a2 >= 0) ? t_distance - (foot_a1*t_distance) : t_foot_pos;
                    t_dist = t_distance-(t_percs[t_percs.length-1]*t_distance);//t_perc;
                    if (t_percs.length) t_percs.pop();

                    //	console.log(a + " <--- " + t_foot_pos + " top = " + top);

                }

                if (t_foot_pos < 0) t_foot_pos = 0;
                if (t_foot_pos > 500) t_foot_pos = 500;
                t_footx = t_foot_pos;

                run.fore[a][12] = t_ground_pos;
                run.fore[a][13] = t_ground_pos2;
                run.fore[a][14] = t_footx;
                run.fore[a][15] = t_foot_pos;
                run.fore[a][16] = f1;
                run.fore[a][17] = top;
                run.fore[a][18] = t_distance;
                run.fore[a][19] = strike;
                run.fore[a][20] = prone;

                last_time = d;
            }
        }
    }
}, {
    /**
     * Returns the minimum information for all stored runs. This information will not include the actual run data,
     * that will need to be loaded after.
     * @return {Array}
     */
    dataPrototypes: {
        get: function() {
            return [
                new Run().init("ballerina", "Ballerina - fore foot"),
                new Run().init("frog", "Frog bouncy pronation"),
                new Run().init("heel", "Extreme heel running"),
                new Run().init("marathon_pace_9.1", "Marathon pace at 9.1min/mile"),
                new Run().init("pronation", "Extreme Pronation"),
                new Run().init("walk_run_sprint", "Progressive Walk, Run, Sprint"),
                new Run().init("50msec", "50 Msec run"),
                new Run().init("10msec", "10 Msec run"),
                new Run().init("50msecheelandwalk", "50 Msec heel and walk"),
                new Run().init("2milerun", "2 Mile Run 50fps")
            ];
        }
    }
});