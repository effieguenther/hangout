/**
 * Interface for a simple text object with a language code.
 */
export interface ITextObject {
  text: string;
  languageCode: string;
}

/**
 * Interface for a more complex text object that includes a URI.
 */
export interface ITextObjectWithUri extends ITextObject {
  flagContentUri?: string;
  disclosureText?: ITextObject;
  reviewsUri?: string;
}

/**
 * Interface for the generative summary provided by AI.
 */
export interface IGenerativeSummary {
  overview: ITextObject;
  overviewFlagContentUri: string;
  disclosureText: ITextObject;
}

export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Represents the main interface for a Place object.
 */
export interface Place {
  id: string;
  types: string[];
  rating: number;
  priceLevel?: string;
  userRatingCount: number;
  displayName: ITextObject;
  dineIn?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer: boolean;
  servesWine: boolean;
  primaryType: string;
  editorialSummary?: ITextObject;
  outdoorSeating: boolean;
  liveMusic: boolean;
  servesCocktails: boolean;
  servesDessert?: boolean;
  servesCoffee?: boolean;
  goodForChildren?: boolean;
  goodForGroups: boolean;
  goodForWatchingSports?: boolean;
  generativeSummary?: IGenerativeSummary;
  location?: Location;
  formattedAddress?: String;
  reviewSummary?: {
    text: ITextObjectWithUri;
    flagContentUri: string;
    disclosureText: ITextObject;
    reviewsUri: string;
  };
}