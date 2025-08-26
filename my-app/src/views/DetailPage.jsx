import React from "react";
import InfoCard from "../components/cards/InfoCard";
import CameraEndpointCard from "../components/cards/CameraEndpointCard";

export default function DetailPage(){
  // モック値（将来はContext/ROSから）
  const mock = {
    heartbeat:   { value: "62", unit: "bpm", status:"ok" },
    wireless:    { value: "RSSI -58", unit: "dBm", status:"ok" },
    battery:     { value: "78", unit: "%", status:"warn" },
    tempMotorRF: { value: "54.2", unit: "℃", status:"ok" },
    tempMotorLF: { value: "52.7", unit: "℃", status:"ok" },
    speedLimit:  { value: "1.20", unit: "m/s", status:"ok" },
    frameRate:   { value: "30", unit: "fps", status:"ok" },
    currentRF:   { value: "10.1", unit: "A", status:"ok" },
  };

  return (
    <div className="p-5">
      {/* 上部: ステータス群（横並び→折返し可） */}
      <div className="grid grid-cols-12 gap-4 mb-5">
        <div className="col-span-12 md:col-span-4">
          <InfoCard title="ハートビート" subtitle="ノード監視" {...mock.heartbeat} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InfoCard title="無線接続" subtitle="リンク品質" {...mock.wireless} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <InfoCard title="バッテリー" subtitle="SoC" {...mock.battery} />
        </div>
      </div>

      {/* 下段: 詳細（2列→縦にも展開） */}
      <div className="grid grid-cols-12 gap-4">
        {/* 左カラム */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <InfoCard title="温度" subtitle="右前モータ" {...mock.tempMotorRF} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <InfoCard title="温度" subtitle="左前モータ" {...mock.tempMotorLF} />
          </div>
          <div className="col-span-12">
            <InfoCard title="速度制限" subtitle="上限" {...mock.speedLimit} />
          </div>
          <div className="col-span-12">
            <InfoCard title="電流" subtitle="右前" {...mock.currentRF} />
          </div>
        </div>

        {/* 右カラム（例外カード: カメラ設定） */}
        <div className="col-span-12 lg:col-span-6">
          <CameraEndpointCard />
          <div className="mt-4">
            <InfoCard title="フレームレート" subtitle="現行" {...mock.frameRate} compact />
          </div>
        </div>
      </div>
    </div>
  );
}