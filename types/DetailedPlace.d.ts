import Place from "./Place";

export default interface DetailedPlace extends Place {
  location?: {
    latitude: number;
    longitude: number;
  };
  formattedAddress?: string;
  websiteUri?: string;
  photoUrl?: string | null;
  photoAttributions?: string[];
  travelTimes?: {
    walking: string | null;
    publicTransit: string | null;
  }
}