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
  flagContentUri?: string; // Optional property
  disclosureText?: ITextObject;
  reviewsUri?: string; // Optional property
}

/**
 * Interface for the generative summary provided by AI.
 */
export interface IGenerativeSummary {
  overview: ITextObject;
  overviewFlagContentUri: string;
  disclosureText: ITextObject;
}

/**
 * Represents the main interface for a Place object.
 */
export interface Place {
  id: string;
  types: string[];
  rating: number;
  priceLevel?: string; // Optional as it's not in all objects
  userRatingCount: number;
  displayName: ITextObject;
  dineIn?: boolean; // Optional property
  servesLunch?: boolean; // Optional property
  servesDinner?: boolean; // Optional property
  servesBeer: boolean;
  servesWine: boolean;
  primaryType: string;
  editorialSummary?: ITextObject; // Optional property
  outdoorSeating: boolean;
  liveMusic: boolean;
  servesCocktails: boolean;
  servesDessert?: boolean; // Optional property
  servesCoffee?: boolean; // Optional property
  goodForChildren?: boolean; // Optional property
  goodForGroups: boolean;
  goodForWatchingSports?: boolean; // Optional property
  generativeSummary?: IGenerativeSummary; // Optional property
  reviewSummary?: {
    text: ITextObjectWithUri;
    flagContentUri: string;
    disclosureText: ITextObject;
    reviewsUri: string;
  };
}