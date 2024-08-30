'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    '--color-primary-0': '230 240 248',
    '--color-primary-50': '204 225 241',
    '--color-primary-100': '179 210 234',
    '--color-primary-200': '153 195 227',
    '--color-primary-300': '128 180 220',
    '--color-primary-400': '102 165 213',
    '--color-primary-500': '35 104 162',  // #2368a2
    '--color-primary-600': '31 93 146',
    '--color-primary-700': '26 82 130',
    '--color-primary-800': '21 71 114',
    '--color-primary-900': '17 60 98',
    '--color-primary-950': '13 49 82',

    /* Secondary (Based on #0D160B) */
    '--color-secondary-0': '240 245 240',   // #F0F5F0
    '--color-secondary-50': '220 225 220',  // #DCE1DC
    '--color-secondary-100': '200 205 200', // #C8CDC8
    '--color-secondary-200': '170 175 170', // #AAAFAA
    '--color-secondary-300': '140 145 140', // #8C918C
    '--color-secondary-400': '110 115 110', // #6E736E
    '--color-secondary-500': '13 22 11',    // #0D160B
    '--color-secondary-600': '11 19 10',    // #0B130A
    '--color-secondary-700': '9 16 8',      // #091008
    '--color-secondary-800': '7 13 6',      // #070D06
    '--color-secondary-900': '5 10 4',      // #050A04
    '--color-secondary-950': '3 7 2',       // #030702

    /* Tertiary */
    '--color-tertiary-0': '245 240 255',
    '--color-tertiary-50': '230 220 255',
    '--color-tertiary-100': '210 190 255',
    '--color-tertiary-200': '190 160 255',
    '--color-tertiary-300': '170 130 255',
    '--color-tertiary-400': '150 100 255',
    '--color-tertiary-500': '130 70 255', // #8247e5
    '--color-tertiary-600': '110 60 230',
    '--color-tertiary-700': '90 50 200',
    '--color-tertiary-800': '70 40 170',
    '--color-tertiary-900': '50 30 140',
    '--color-tertiary-950': '30 20 110',

    /* Error */
    '--color-error-0': '255 235 234',
    '--color-error-50': '255 220 218',
    '--color-error-100': '255 190 186',
    '--color-error-200': '255 150 144',
    '--color-error-300': '255 110 102',
    '--color-error-400': '247 85 78',
    '--color-error-500': '217 83 79', // #d9534f
    '--color-error-600': '195 75 71',
    '--color-error-700': '173 67 63',
    '--color-error-800': '151 59 55',
    '--color-error-900': '129 51 47',
    '--color-error-950': '107 43 39',

    /* Success */
    '--color-success-0': '233 255 238',
    '--color-success-50': '204 255 218',
    '--color-success-100': '167 247 188',
    '--color-success-200': '128 239 158',
    '--color-success-300': '89 231 128',
    '--color-success-400': '50 223 98',
    '--color-success-500': '33 186 69', // #21ba45
    '--color-success-600': '29 167 62',
    '--color-success-700': '25 148 55',
    '--color-success-800': '21 129 48',
    '--color-success-900': '18 110 41',
    '--color-success-950': '14 91 34',

    /* Warning */
    '--color-warning-0': '255 249 235',
    '--color-warning-50': '255 243 204',
    '--color-warning-100': '255 231 173',
    '--color-warning-200': '255 218 142',
    '--color-warning-300': '255 205 111',
    '--color-warning-400': '255 192 80',
    '--color-warning-500': '242 192 55', // #f2c037
    '--color-warning-600': '217 173 49',
    '--color-warning-700': '193 154 43',
    '--color-warning-800': '169 135 37',
    '--color-warning-900': '145 116 31',
    '--color-warning-950': '121 97 25',

    /* Info */
    '--color-info-0': '235 246 253',
    '--color-info-50': '204 232 250',
    '--color-info-100': '173 218 247',
    '--color-info-200': '142 204 244',
    '--color-info-300': '111 190 241',
    '--color-info-400': '100 180 235',
    '--color-info-500': '136 204 241', // #88ccf1
    '--color-info-600': '122 184 217',
    '--color-info-700': '108 164 193',
    '--color-info-800': '94 144 169',
    '--color-info-900': '80 124 145',
    '--color-info-950': '66 104 121',

    /* Typography */
    '--color-typography-0': '254 254 255',
    '--color-typography-50': '245 245 245',
    '--color-typography-100': '229 229 229',
    '--color-typography-200': '219 219 220',
    '--color-typography-300': '212 212 212',
    '--color-typography-400': '163 163 163',
    '--color-typography-500': '140 140 140',
    '--color-typography-600': '115 115 115',
    '--color-typography-700': '82 82 82',
    '--color-typography-800': '64 64 64',
    '--color-typography-900': '38 38 39',
    '--color-typography-950': '23 23 23',

    /* Outline */
    '--color-outline-0': '253 254 254',
    '--color-outline-50': '243 243 243',
    '--color-outline-100': '230 230 230',
    '--color-outline-200': '221 220 219',
    '--color-outline-300': '211 211 211',
    '--color-outline-400': '165 163 163',
    '--color-outline-500': '140 141 141',
    '--color-outline-600': '115 116 116',
    '--color-outline-700': '83 82 82',
    '--color-outline-800': '65 65 65',
    '--color-outline-900': '39 38 36',
    '--color-outline-950': '26 23 23',

    /* Background */
    '--color-background-0': '255 255 255',
    '--color-background-50': '246 246 246',
    '--color-background-100': '242 241 241',
    '--color-background-200': '220 219 219',
    '--color-background-300': '213 212 212',
    '--color-background-400': '162 163 163',
    '--color-background-500': '142 142 142',
    '--color-background-600': '116 116 116',
    '--color-background-700': '83 82 82',
    '--color-background-800': '65 64 64',
    '--color-background-900': '39 38 37',
    '--color-background-950': '24 23 24',

    /* Background Special */
    '--color-background-error': '254 241 241',
    '--color-background-warning': '255 244 235',
    '--color-background-success': '237 252 242',
    '--color-background-muted': '247 248 247',
    '--color-background-info': '235 248 254',

    /* Focus Ring Indicator  */
    '--color-indicator-primary': '55 55 55',
    '--color-indicator-info': '83 153 236',
    '--color-indicator-error': '185 28 28',
  }),
};
