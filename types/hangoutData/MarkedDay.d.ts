export default interface MarkedDay {
  dateString: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  dotColor?: string;
  selectedDotColor?: string;
}