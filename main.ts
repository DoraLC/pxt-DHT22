enum dht22type {
    //% block="Celsius"
    Celsius,
    //% block="Fahrenheit"
    Fahrenheit,
    //% block="humidity"
    humidity
}

//% color=#F6421B icon="\uf2c9" block="DHT22"
namespace DHT22 {
    let pin = DigitalPin.P0
    function signal_dht22(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        pins.setPull(pin, PinPullMode.PullUp)
    }

    /**
     * Set up the sensor and start reading data.
     *
     */
    //% block="DHT22 pin %pin_arg|data %data_type"
    //% blockId=reading_dht22_data
    //% pin_arg.fieldEditor="gridpicker" pin_arg.fieldOptions.columns=5
    //% pin_arg.fieldOptions.tooltips="false"
    //% weight=0
    export function dht22_read(pin_arg: DigitalPin, data_type: dht22type): number {
        basic.pause(500)
        pin = pin_arg
        signal_dht22(pin)

        // Wait for response header to finish
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        let counter = 0
        let value = 0
        let value2 = 0
        let value3 = 0

        for (let i = 0; i <= 40 - 1; i++) {
            while (pins.digitalReadPin(pin) == 0);
            counter = 0
            while (pins.digitalReadPin(pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                if (i < 16) {
                    value = value + (1 << (15 - i));
                }
                else if (i < 32) {
                    value2 = value2 + (1 << (31 - i))
                }
                else {
                    value3 = value3 + (1 << (39 - i))
                }
            }
        }

        switch (data_type) {
            case 0:
                return value2 / 10
            case 1:
                return (value2 / 10) * 9 / 5 + 32
            case 2:
                return value / 10
            default:
                return 0
        }
    }
}