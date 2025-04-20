
export interface KnowledgeNodeDisplay {
  id: string;
  title: string;
  slug: string;
  description: string;
  verificationPercentage: number;
  blocks: {
    id: string;
    title: string;
    content: string;
    links: { title: string; slug: string }[];
  }[];
  relatedNodes: {
    id: string;
    title: string;
    slug: string;
    description: string;
    verificationPercentage: number;
  }[];
}
