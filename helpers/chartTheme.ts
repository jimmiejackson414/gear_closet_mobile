import { Theme } from '@/types';

export interface Option {
  label: string;
  value: Theme;
  colors: string[];
}

export const Blue6 = [
  '#0f6fc6',
  '#009dd9',
  '#0bd0d9',
  '#10cf9b',
  '#7cca62',
  '#a5c249',
];

export const BlueGreen6 = [
  '#3494ba',
  '#58b6c0',
  '#75bda7',
  '#7a8c8e',
  '#84acb6',
  '#2683c6',
];

export const Breeze6 = [
  '#2c7c9f',
  '#244a58',
  '#e2751d',
  '#ffb400',
  '#7eb606',
  '#c00000',
];

export const Celestial6 = [
  '#ac3ec1',
  '#477bd1',
  '#46b298',
  '#90ba4c',
  '#dd9d31',
  '#e25247',
];

export const Circuit6 = [
  '#9acd4c',
  '#faa93a',
  '#d35940',
  '#b258d3',
  '#63a0cc',
  '#8ac4a7',
];

export const Damask6 = [
  '#9ec544',
  '#50bea3',
  '#4a9ccc',
  '#9a66ca',
  '#c54f71',
  '#de9c3c',
];

export const Depth6 = [
  '#41aebd',
  '#97e9d5',
  '#a2cf49',
  '#608f3d',
  '#f4de3a',
  '#fcb11c',
];

export const Flow6 = [
  '#0f6fc6',
  '#009dd9',
  '#0bd0d9',
  '#10cf9b',
  '#7cca62',
  '#a5c249',
];

export const Forte6 = [
  '#c70f0c',
  '#dd6b0d',
  '#faa700',
  '#93e50d',
  '#17c7ba',
  '#0a96e4',
];

export const Genesis6 = [
  '#80b606',
  '#e29f1d',
  '#2397e2',
  '#35aca2',
  '#5430bb',
  '#8d34e0',
];

export const Grayscale6 = [
  '#dddddd',
  '#b2b2b2',
  '#969696',
  '#808080',
  '#5f5f5f',
  '#4d4d4d',
];

export const IonBoardroom6 = [
  '#b31166',
  '#e33d6f',
  '#e45f3c',
  '#e9943a',
  '#9b6bf2',
  '#d53dd0',
];

export const Kilter6 = [
  '#76c5ef',
  '#fea022',
  '#ff6700',
  '#70a525',
  '#a5d848',
  '#20768c',
];

export const Tableau10 = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

export const ColorBlind10 = [
  '#1170aa',
  '#fc7d0b',
  '#a3acb9',
  '#57606c',
  '#5fa2ce',
  '#c85200',
  '#7b848f',
  '#a3cce9',
  '#ffbc79',
  '#c8d0d9',
];

export const JewelBright9 = [
  '#eb1e2c',
  '#fd6f30',
  '#f9a729',
  '#f9d23c',
  '#5fbb68',
  '#64cdcc',
  '#91dcea',
  '#a4a4d5',
  '#bbc9e5',
];

export const HueCircle19 = [
  '#1ba3c6',
  '#2cb5c0',
  '#30bcad',
  '#21B087',
  '#33a65c',
  '#57a337',
  '#a2b627',
  '#d5bb21',
  '#f8b620',
  '#f89217',
  '#f06719',
  '#e03426',
  '#f64971',
  '#fc719e',
  '#eb73b3',
  '#ce69be',
  '#a26dc2',
  '#7873c0',
  '#4f7cba',
];

export const findTheme = (theme: Theme | string | undefined | null): string[] => {
  switch (theme) {
    case Theme.BLUE6:
      return Blue6;
    case Theme.BLUEGREEN6:
      return BlueGreen6;
    case Theme.BREEZE6:
      return Breeze6;
    case Theme.CELESTIAL6:
      return Celestial6;
    case Theme.CIRCUIT6:
      return Circuit6;
    case Theme.DAMASK6:
      return Damask6;
    case Theme.DEPTH6:
      return Depth6;
    case Theme.FLOW6:
      return Flow6;
    case Theme.FORTE6:
      return Forte6;
    case Theme.GENESIS6:
      return Genesis6;
    case Theme.GRAYSCALE6:
      return Grayscale6;
    case Theme.IONBOARDROOM6:
      return IonBoardroom6;
    case Theme.KILTER6:
      return Kilter6;
    case Theme.TABLEAU10:
      return Tableau10;
    case Theme.COLORBLIND10:
      return ColorBlind10;
    case Theme.JEWELBRIGHT9:
      return JewelBright9;
    case Theme.HUECIRCLE19:
      return HueCircle19;
    default:
      return Blue6;
  }
};

const generateThemeOptions = (): Option[] => {
  const office = [
    {
      label: Theme.BLUE6, value: Theme.BLUE6, colors: Blue6,
    },
    {
      label: Theme.BLUEGREEN6, value: Theme.BLUEGREEN6, colors: BlueGreen6,
    },
    {
      label: Theme.BREEZE6, value: Theme.BREEZE6, colors: Breeze6,
    },
    {
      label: Theme.CELESTIAL6, value: Theme.CELESTIAL6, colors: Celestial6,
    },
    {
      label: Theme.CIRCUIT6, value: Theme.CIRCUIT6, colors: Circuit6,
    },
    {
      label: Theme.DAMASK6, value: Theme.DAMASK6, colors: Damask6,
    },
    {
      label: Theme.DEPTH6, value: Theme.DEPTH6, colors: Depth6,
    },
    {
      label: Theme.FLOW6, value: Theme.FLOW6, colors: Flow6,
    },
    {
      label: Theme.FORTE6, value: Theme.FORTE6, colors: Forte6,
    },
    {
      label: Theme.GENESIS6, value: Theme.GENESIS6, colors: Genesis6,
    },
    {
      label: Theme.IONBOARDROOM6, value: Theme.IONBOARDROOM6, colors: IonBoardroom6,
    },
    {
      label: Theme.KILTER6, value: Theme.KILTER6, colors: Kilter6,
    },
  ];

  const tableau = [
    {
      label: Theme.TABLEAU10, value: Theme.TABLEAU10, colors: Tableau10,
    },
    {
      label: Theme.COLORBLIND10, value: Theme.COLORBLIND10, colors: ColorBlind10,
    },
    {
      label: Theme.JEWELBRIGHT9, value: Theme.JEWELBRIGHT9, colors: JewelBright9,
    },
    {
      label: Theme.HUECIRCLE19, value: Theme.HUECIRCLE19, colors: HueCircle19,
    },
  ];

  return [office, tableau].flat();
};

export default generateThemeOptions;
