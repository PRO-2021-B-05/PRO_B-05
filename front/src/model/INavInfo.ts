export interface INavInfo {
  title?: string | null;
  section: [
    {
      id: number;
      title?: string;
      content?: string;
    }
  ];
}
