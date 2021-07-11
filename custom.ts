
/**
* このファイルを使って、独自の関数やブロックを定義してください。
* 詳しくはこちらを参照してください：https://makecode.microbit.org/blocks/custom
*/

/**
 * 自動水やりマシン blocks
 */
//% weight=100 color=#0fbc11 icon="\uf1ec"
namespace 自動水やりマシン {
    /**
         * TODO: describe
         * @param value describe value here
         */
    //% block
    //% weight=100
    export function 気温および湿度センサを初期化() {
        // user registerのreserveを読み取る
        let user_register = 0
        let reserve_a = 0
        let reserve_b = 0
        let reserve = 0
        let user_register_def = 0

        pins.i2cWriteNumber(
            64,
            231,
            NumberFormat.Int8LE,
            true
        )
        user_register = pins.i2cReadNumber(64, NumberFormat.Int8LE, false)
        user_register = user_register
        reserve_a = user_register % 8
        reserve_b = user_register % 64
        reserve = reserve_b - reserve_a
        // user registerのデフォルト値を作成
        user_register_def = reserve + 2

        // デフォルト値をuser registerにセット
        pins.i2cWriteNumber(
            64,
            230,
            NumberFormat.Int8LE,
            true
        )
        pins.i2cWriteNumber(
            64,
            user_register_def,
            NumberFormat.Int8LE,
            false
        )

        // ソフトリセット
        pins.i2cWriteNumber(
            64,
            254,
            NumberFormat.Int8LE,
            false
        )
        basic.pause(100)
    }

    /**
     * TODO: describe
     * @param value describe value here
     */
    //% block="気温を読み取る[度]"
    //% weight=99
    export function 気温を読み取る(): number {
        let T_MSB = 0
        let T_LSB = 0
        let T_CHECK = 0
        let T = 0
        let T_CONVERTED = 0

        // 気温読み取り開始
        pins.i2cWriteNumber(
            64,
            227,
            NumberFormat.Int8LE,
            true
        )
        T_MSB = pins.i2cReadNumber(64, NumberFormat.UInt8LE, true)
        T_LSB = pins.i2cReadNumber(64, NumberFormat.UInt8LE, true)
        T_CHECK = pins.i2cReadNumber(64, NumberFormat.UInt8LE, false)
        // T_MSBを左へ8bitずらす
        T_MSB = T_MSB * 256
        // statの分右へ2bit1
        T_LSB = T_LSB / 4
        T = T_LSB + T_MSB
        // statが常に0.5だから、それを差し引く
        T = Math.trunc(T)
        T_CONVERTED = 175.72 * (T / 65536) - 46.85

        return T_CONVERTED
    }

    /**
     * TODO: describe
     * @param value describe value here
     */
    //% block="湿度を読み取る[パーセント]"
    //% weight=98
    export function 湿度を読み取る(): number {
        let RH_MSB = 0
        let RH_LSB = 0
        let RH_CHECK = 0
        let RH = 0
        let RH_CONVERTED = 0

        // 湿度・読み取り
        pins.i2cWriteNumber(
            64,
            229,
            NumberFormat.Int8LE,
            true
        )
        RH_MSB = pins.i2cReadNumber(64, NumberFormat.UInt8LE, true)
        RH_LSB = pins.i2cReadNumber(64, NumberFormat.UInt8LE, true)
        RH_CHECK = pins.i2cReadNumber(64, NumberFormat.UInt8LE, false)
        // RH_MSBを左へ8bitずらす
        RH_MSB = RH_MSB * 256
        // statの分右へ2bit1
        RH_LSB = RH_LSB / 4
        RH = RH_LSB + RH_MSB
        // statが常に0.5だから、それを差し引く
        RH = Math.trunc(RH)
        RH_CONVERTED = 125 * (RH / 65536) - 6

        return RH_CONVERTED
    }



    /**
     * TODO: describe
     * @param value describe value here
     */
    //% block="光量を読み取る[ルクス]"
    //% weight=97
    export function 光量を読み取る(): number {
        let LX_MSB = 0
        let LX_LSB = 0
        let LX = 0
        let LX_CONVERTED = 0
        
        // 明るさの読み取り
        pins.i2cWriteNumber(
            92,
            35,
            NumberFormat.Int8LE,
            false
        )
        LX_MSB = pins.i2cReadNumber(92, NumberFormat.UInt8LE, true)
        LX_LSB = pins.i2cReadNumber(92, NumberFormat.UInt8LE, false)
        LX_MSB = LX_MSB * 256
        LX = LX_MSB + LX_LSB
        LX_CONVERTED = LX / 1.2
        LX_CONVERTED = Math.trunc(LX)

        return LX_CONVERTED
    }

    /**
     * TODO: describe
     * @param value describe value here
     */
    //% block="土壌水分センサの出力電圧$Voutを0~100パーセントに変換する (空気中の出力電圧$Vout_on_air、水中での出力電圧$Vout_in_water)"
    //% weight=96
    export function 土壌水分センサの出力電圧を変換(Vout: number, Vout_on_air: number, Vout_in_water: number) {
        let result = 0
        result = Vout - Vout_on_air
        result = result / (Vout_in_water - Vout_on_air)
        result = result * 100
        return result
    }
}
