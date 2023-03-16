export interface Theme {
  fieldHeight: number;
  primary: string;
  success: string;
  danger: string;
  cyan: string;
  coldTurkey: string;
  blue: string;
  red919: string;
  green022: string;
  gray: string;
  yellow: string;
  sky: string;
  orange: string;
  iconColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  gumbo: string;
}

export default {
  // shape
  fieldHeight: 40,
  // colors
  primary: "#1E5A6E",
  success: "#27AE60",
  coldTurkey: "#CDB9B9",
  danger: "#C32E09",
  cyan: "#16837C",
  blue: "#1B5272",
  red919: "#E81919",
  green022: "#26C022",
  gray: "#E8E6E2",
  yellow: "#F3CC26",
  sky: "#00FFFF",
  orange: "#F08262",
  iconColor: "inherit",
  // fonts
  textColor: "#fff",
  fontSize: 16,
  fontFamily: `"Gotham", "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif`,
  gumbo: "#789ca8"
} as Theme;
