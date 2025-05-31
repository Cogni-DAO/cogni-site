import { MemoryBlockType } from '@/data/models/memoryBlockType';
import type { ProjectMetadata } from './project';
import type { TaskMetadata } from './task';
import type { DocMetadata } from './doc';
import type { KnowledgeMetadata } from './knowledge';
import type { LogMetadata } from './log';
import type { EpicMetadata } from './epic';
import type { BugMetadata } from './bug';

/**
 * Type map to help with narrowing metadata types based on block type
 */
export interface BlockMetadataByType {
  project: ProjectMetadata;
  task: TaskMetadata;
  doc: DocMetadata;
  knowledge: KnowledgeMetadata;
  interaction: Record<string, unknown>; // No specific metadata schema for interaction type yet
  log: LogMetadata;
  epic: EpicMetadata;
  bug: BugMetadata;
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
