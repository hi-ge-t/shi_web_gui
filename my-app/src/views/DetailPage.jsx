// ./src/views/DetailPage.jsx
import React, { useState } from "react";
import StatusBar from "../components/StatusBar";
import InfoCard from "../components/cards/InfoCard";
import CameraEndpointCard from "../components/cards/CameraEndpointCard";
import { MockRobotStatusProvider } from "../contexts/RobotStatusContext";

export default function DetailPage() {
  // モック状態（本番はContext/Providerへ）
  const [motorCurrentRF, setMotorCurrentRF] = useState(10.1);
  const [motorLimit, setMotorLimit] = useState(30);
  const [wirelessPref, setWirelessPref] = useState("primary");
  const [frameRate, setFrameRate] = useState(30);

  const [endpoints, setEndpoints] = useState([
    { label: "俯瞰", url: "http://localhost:8081/stream?topic=/cam/top" },
    { label: "左前", url: "http://localhost:8081/stream?topic=/cam/fl"  },
    { label: "右前", url: "http://localhost:8081/stream?topic=/cam/fr"  },
  ]);

  const onChangeEndpoint = (idx, newUrl) => {
    setEndpoints((prev) => prev.map((e, i) => (i === idx ? { ...e, url: newUrl } : e)));
  };

  const stubSave = (name) => () => console.log(`[SAVE] ${name}`);

  const [motorA, setMotorA] = useState(10.0);
  const [speed, setSpeed] = useState(1000);

  return (
    <MockRobotStatusProvider tick>
      <div className="w-[1920px] h-[1200px] flex flex-col bg-neutral-100 overflow-hidden">

        {/* ✅ カード配置（既存のboard-gridをそのまま） */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-[1920px] w-full mx-auto overflow-x-hidden">
            <div className="flex gap-4">
              {/* gap-x = 1rem (=16px) 前提。列幅 = (100% - 4rem) / 5 */}
              {/* 1列目（20%） */}
              <div className="basis-[calc((100%-1rem*10)/5)] shrink-0 flex flex-col gap-4">
                <InfoCard
                  title="モータ設定"
                  subtitle="電流値：右前"
                  unit="A"
                  min={0} max={30} step={0.1}
                  value={motorA}
                  onApply={(v)=>setMotorA(v)}
                  onCancel={()=>console.log("cancel motorA")}
                />
                <InfoCard
                  title="モータ設定"
                  subtitle="電流値：右前"
                  unit="A"
                  min={0} max={30} step={0.1}
                  value={motorA}
                  onApply={(v)=>setMotorA(v)}
                  onCancel={()=>console.log("cancel motorA")}
                />
                <InfoCard
                  title="モータ設定"
                  subtitle="電流値：右前"
                  unit="A"
                  min={0} max={30} step={0.1}
                  value={motorA}
                  onApply={(v)=>setMotorA(v)}
                  onCancel={()=>console.log("cancel motorA")}
                />
                <InfoCard
                  title="モータ設定"
                  subtitle="電流値：右前"
                  unit="A"
                  min={0} max={30} step={0.1}
                  value={motorA}
                  onApply={(v)=>setMotorA(v)}
                  onCancel={()=>console.log("cancel motorA")}
                />
                <InfoCard
                  title="モータ設定"
                  subtitle="電流値：右前"
                  unit="A"
                  min={0} max={30} step={0.1}
                  value={motorA}
                  onApply={(v)=>setMotorA(v)}
                  onCancel={()=>console.log("cancel motorA")}
                />
              </div>

              {/* 2列目（20%） */}
              <div className="basis-[calc((100%-1rem*10)/5)] shrink-0 flex flex-col gap-4">
                <InfoCard
                  title="移動速度"
                  subtitle="上限値"
                  unit="mm/s"
                  min={0} max={3000} step={10}
                  value={speed}
                  onApply={(v)=>setSpeed(v)}
                />
                <InfoCard
                  title="移動速度"
                  subtitle="上限値"
                  unit="mm/s"
                  min={0} max={3000} step={10}
                  value={speed}
                  onApply={(v)=>setSpeed(v)}
                />
                <InfoCard
                  title="移動速度"
                  subtitle="上限値"
                  unit="mm/s"
                  min={0} max={3000} step={10}
                  value={speed}
                  onApply={(v)=>setSpeed(v)}
                />
                <InfoCard
                  title="移動速度"
                  subtitle="上限値"
                  unit="mm/s"
                  min={0} max={3000} step={10}
                  value={speed}
                  onApply={(v)=>setSpeed(v)}
                />
                <InfoCard
                  title="移動速度"
                  subtitle="上限値"
                  unit="mm/s"
                  min={0} max={3000} step={10}
                  value={speed}
                  onApply={(v)=>setSpeed(v)}
                />
              </div>

              {/* 3列目（20%） */}
              <div className="basis-[calc((100%-1rem*10)/5)] shrink-0 flex flex-col gap-4">
                <InfoCard
                  title="温度上限"
                  subtitle="制限値(警告)"
                  unit="℃"
                  min={0} max={100} step={1}
                  value={50}
                  onApply={(v)=>console.log("save temp limit:", v)}
                />
                <InfoCard
                  title="温度上限"
                  subtitle="制限値(警告)"
                  unit="℃"
                  min={0} max={100} step={1}
                  value={50}
                  onApply={(v)=>console.log("save temp limit:", v)}
                />
                <InfoCard
                  title="温度上限"
                  subtitle="制限値(警告)"
                  unit="℃"
                  min={0} max={100} step={1}
                  value={50}
                  onApply={(v)=>console.log("save temp limit:", v)}
                />
                <InfoCard
                  title="温度上限"
                  subtitle="制限値(警告)"
                  unit="℃"
                  min={0} max={100} step={1}
                  value={50}
                  onApply={(v)=>console.log("save temp limit:", v)}
                />
                <InfoCard
                  title="温度上限"
                  subtitle="制限値(警告)"
                  unit="℃"
                  min={0} max={100} step={1}
                  value={50}
                  onApply={(v)=>console.log("save temp limit:", v)}
                />
              </div>
              
              {/* 右側：4〜5列を占有（40%） */}
              {/* 右2列＝単列幅×2 + 列間の1rem を加算 */}
              <div className="basis-[calc(((100%-1rem*10)/5)*2+1rem)] shrink-0">
                {/* 右側の中は2カラムGridで“列ベース”管理 */}
                <div className="grid grid-cols-2 gap-4 auto-rows-max">
                  {/* 上段：カメラは2列分を占有 */}
                  <div className="col-span-2">
                    <CameraEndpointCard
                      className="h-[300px] max-h-[400px]"
                      title="カメラ設定"
                      subtitle="接続先"
                      onApply={(map)=>console.log("save camera map:", map)}
                      onCancel={()=>console.log("cancel camera map")}
                    />
                  </div>

                  {/* 4列目・下段 */}
                  <div className="flex flex-col gap-4">
                    <InfoCard
                      title="4列目：下段カード"
                      subtitle="例：カメラ関連のしきい値"
                      unit="ms"
                      min={0} max={500} step={10}
                      value={100}
                      onApply={(v)=>console.log("apply col4-bottom", v)}
                    />
                    <InfoCard
                      title="4列目：下段カード"
                      subtitle="例：カメラ関連のしきい値"
                      unit="ms"
                      min={0} max={500} step={10}
                      value={100}
                      onApply={(v)=>console.log("apply col4-bottom", v)}
                    />
                    <InfoCard
                      title="4列目：下段カード"
                      subtitle="例：カメラ関連のしきい値"
                      unit="ms"
                      min={0} max={500} step={10}
                      value={100}
                      onApply={(v)=>console.log("apply col4-bottom", v)}
                    />
                  </div>

                  {/* 5列目・下段 */}
                  <div className="flex flex-col gap-4">
                    <InfoCard
                      title="5列目：下段カード"
                      subtitle="例：別カメラ設定"
                      unit="mm"
                      min={0} max={100} step={1}
                      value={50}
                      onApply={(v)=>console.log("apply col5-bottom", v)}
                    />
                    <InfoCard
                      title="5列目：下段カード"
                      subtitle="例：別カメラ設定"
                      unit="mm"
                      min={0} max={100} step={1}
                      value={50}
                      onApply={(v)=>console.log("apply col5-bottom", v)}
                    />
                    <InfoCard
                      title="5列目：下段カード"
                      subtitle="例：別カメラ設定"
                      unit="mm"
                      min={0} max={100} step={1}
                      value={50}
                      onApply={(v)=>console.log("apply col5-bottom", v)}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </MockRobotStatusProvider>
  );
}