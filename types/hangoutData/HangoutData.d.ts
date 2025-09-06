import Contact from "./Contact";
import Filters from "./Filters";
import MarkedDay from "./MarkedDay";

export default interface HangoutData {
  date?: MarkedDay[];
  invitedContacts?: Contact[];
  filters?: Filters;
}