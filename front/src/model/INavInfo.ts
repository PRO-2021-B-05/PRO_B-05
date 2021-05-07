export interface INavInfo {
  title: string | null;
  subtitle: string | null;
  section: [
    {
      id: number;
      title: string;
      content: string | null;
    }
  ];
}
