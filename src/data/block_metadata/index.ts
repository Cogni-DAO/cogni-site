import { MemoryBlockType } from '@/data/models/memoryBlockType';
import type { ProjectMetadata } from './project';
import type { TaskMetadata } from './task';
import type { DocMetadata } from './doc';
import type { KnowledgeMetadata } from './knowledge';
import type { LogMetadata } from './log';
import type { InteractionMetadata } from './interaction';

/**
 * Type map to help with narrowing metadata types based on block type
 */
export interface BlockMetadataByType {
  project: ProjectMetadata;
  task: TaskMetadata;
  doc: DocMetadata;
  knowledge: KnowledgeMetadata;
  log: LogMetadata;
  interaction: InteractionMetadata;
}

/**
 * Helper function to narrow metadata type based on block type
 */
export function narrowMetadata<T extends MemoryBlockType>(
  blockType: T,
  metadata: unknown
): BlockMetadataByType[T] {
  return metadata as BlockMetadataByType[T];
}
