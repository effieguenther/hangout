interface APITextObject {
  text: string;
  languageCode: string;
}

interface APITextObjectWithUri extends APITextObject {
  flagContentUri?: string;
  disclosureText?: APITextObject;
  reviewsUri?: string;
}

interface APIGenerativeSummary {
  overview: APITextObject;
  overviewFlagContentUri: string;
  disclosureText: APITextObject;
}

export default interface Place {
  id: string;
  types: string[];
  rating: number;
  priceLevel?: string;
  userRatingCount: number;
  displayName: APITextObject;
  dineIn?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer: boolean;
  servesWine: boolean;
  primaryType: string;
  editorialSummary?: APITextObject;
  outdoorSeating: boolean;
  liveMusic: boolean;
  servesCocktails: boolean;
  servesDessert?: boolean;
  servesCoffee?: boolean;
  goodForChildren?: boolean;
  goodForGroups: boolean;
  goodForWatchingSports?: boolean;
  generativeSummary?: APIGenerativeSummary;
  reviewSummary?: {
    text: APITextObjectWithUri;
    flagContentUri: string;
    disclosureText: APITextObject;
    reviewsUri: string;
  };
}