<template>
  <div
    class="recorder_container"
    :style="recordering ? { background: '#00AEA3' } : { background: '#D0D0D0' }"
  >
    <div
      class="startbtn"
      v-show="!recordering && !loading"
      @click="startRecording"
    ></div>
    <div
      class="stopbtn"
      v-show="recordering && !loading"
      @click="stopRecording"
    >
      <!-- <Loading></Loading> -->
    </div>
    <div class="disabledBtn" v-show="loading"></div>
  </div>
</template>

<script>
const Image = require("./images/recordericon.svg");
import Loading from "./loading";
import axios from "axios";

var interval = null;
let recorder = new Recorder({
  sampleBits: 16,
  sampleRate: 16000,
  numChannels: 1,
  compiling: true,
});
// 录音
var Buffer = require("buffer/").Buffer;
var testSampleRate = 16000;
var testBitRate = 16;
var SendInterval = 80;
var RealTimeSendTryReset = function (type) {
  realTimeSendTryType = type;
  realTimeSendTryTime = 0;
};
var realTimeSendTryType;
var realTimeSendTryEncBusy;
var realTimeSendTryTime = 0;
var realTimeSendTryNumber;
var transferUploadNumberMax;
var realTimeSendTryChunk;
var TransferUpload = function (number, blobOrNull, duration, blobRec, isClose) {
  transferUploadNumberMax = Math.max(transferUploadNumberMax, number);
  if (blobOrNull) {
    var blob = blobOrNull;
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var file = reader.result;
      const buffer = Buffer.from(file);
      if (asrService) {
        asrService.sendAsrAudio(buffer);
      }
    };
    const blobdata = reader.readAsArrayBuffer(blob);
  }

  if (isClose) {
    console.log(
      "No." +
        (number < 100 ? ("000" + number).substr(-3) : number) +
        ":已停止传输"
    );
  }
};

let asrService = null;
export default {
  props: {
    send: {
      type: Function,
    },
    getAsrText: {
      type: Function,
    },
    changeFocusStatus: {
      type: Function,
    },
    loading: {
      type: Boolean,
    },
  },
  data: () => {
    return {
      Image,
      appData: {
        tenantId: "",
        userId: "",
        robotId: "",
        asrsererAddress: "",
      },
      recordering: false,
      asrIsFalse: "",
      asrIsTrue: "",

      rec: null,
      isFail: false,
      isfrist: true,
    };
  },
  components: {
    Loading,
  },
  created() {
    axios.get("/app.json").then((res) => {
      this.appData = res.asrinfo;
      this.asrStart();
    });
  },
  methods: {
    asrStart() {
      let that = this;
      var config = {
        tenantId: that.appData.tenantId,
        userId: that.appData.userId,
        robotId: that.appData.robotId,
        vendor: "CloudMinds",
        version: "",
        timestamp: new Date().getTime(),
        language: "CH",
        dialect: "CH",
        rate: 16000,
        format: "pcm",
        recognizeOnly: true,
      };
      asrService = new ASRService();
      asrService.onMessageCB = function (param) {
        console.log("param_++__+_+_+", param);
        that.showAsrResult(param);
      };
      asrService.onTipCB = function (msg, code) {};
      asrService.onInited = function () {
        // console.log("asrService-onInited");
      };
      asrService.init(config, that.appData.asrsererAddress, "");
    },
    showAsrResult(param) {
      var message = JSON.parse(param);
      if (message.data.value.isEnd == true) {
        this.asrIsFalse = "";
        this.asrIsTrue += message.data.value.asrResult;
        this.recorderEvent();
      } else {
        this.asrIsFalse = message.data.value.asrResult;
      }
      const text = this.asrIsTrue || "" + this.asrIsFalse || "";
      this.getAsrText(text);
    },
    recorderEvent(tip) {
      let that = this;
      clearTimeout(that.timeout);
      that.timeout = null;
      that.timeout = setTimeout(() => {
        if (tip) {
          that.recordering ? that.stopRecording() : that.startRecording();
        } else {
          that.recordering ? that.stopRecording() : "";
        }
        clearTimeout(that.timeout);
      }, 100);
    },
    startRecording() {
      let that = this;
      this.recordering = true;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      recorder.start().then(
        () => {
          interval = setInterval(() => {
            if (asrService) {
              asrService.sendAsrAudio(recorder.getNextData()).then((res) => {
                if (res.code != 0) {
                  console.log(res.msg);
                }
              });
            }
          }, 100);
        },
        (error) => {
          // 出错了
          console.log(`出错了`);
        }
      );
      // that.rec.open(
      //   function () {
      //     that.rec.start();
      //     RealTimeSendTryReset("pcm");
      //     that.isFail = true;
      //     that.recordering = true;
      //     that.changeFocusStatus(true);
      //   },
      //   function (msg) {
      //     that.isFail = false;
      //     that.$message.error(msg);
      //   }
      // );
    },
    stopRecording() {
      recorder.stop();
      clearInterval(interval);
      this.rec = null;
      this.recordering = false;
      this.changeFocusStatus(false);
      this.asrIsTrue = "";
      this.asrIsFalse = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.recorder_container {
  border-radius: 40px;
}

.startbtn {
  width: 38px;
  height: 38px;
  position: relative;
  background: url(./images/record-abled.png) no-repeat center center;
  background-size: cover;
  cursor: pointer;
}

.stopbtn {
  width: 38px;
  height: 38px;
  position: relative;
  background: url(./images/record-ing.png) no-repeat center center;
  background-size: cover;
  cursor: pointer;
}

.disabledBtn {
  width: 38px;
  height: 38px;
  position: relative;
  background: url(./images/record-disabled.png) no-repeat center center;
  background-size: cover;
  cursor: pointer;
}
</style>
