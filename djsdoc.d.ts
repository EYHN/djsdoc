declare function djsdoc(comment: string): {
  description: string;
  tags: {
      title: string;
      content: any;
  }[];
}

declare namespace djsdoc {
}

export = djsdoc