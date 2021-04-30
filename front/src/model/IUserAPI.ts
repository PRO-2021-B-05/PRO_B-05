export interface UserAPI {
  results: {
    gender: string;
    name: {
      titre: string;
      first: string;
      last: string;
    };
    location: undefined;
  }[];
}
