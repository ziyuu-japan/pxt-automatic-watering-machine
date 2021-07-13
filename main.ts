let 土壌センサ出力電圧 = 0
serial.redirect(
SerialPin.P15,
SerialPin.P14,
BaudRate.BaudRate9600
)
自動水やりマシン.気温および湿度センサを初期化()
serial.writeLine("START")
basic.forever(function () {
    土壌センサ出力電圧 = pins.analogReadPin(AnalogPin.P0)
    serial.writeNumbers([
    自動水やりマシン.気温を読み取る(),
    自動水やりマシン.湿度を読み取る(),
    自動水やりマシン.光量を読み取る(),
    自動水やりマシン.土壌水分センサの出力電圧を変換(土壌センサ出力電圧, 621, 332)
    ])
    basic.showNumber(土壌センサ出力電圧)
    basic.pause(1000)
})
