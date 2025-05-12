import React, { ComponentType, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { rendererManifest } from './blockRendererRegistry.data'; // Auto-generated

// Define a type for the props that all block renderers should accept
// TODO: Refine this type based on actual block data structure from schemas
interface BlockRendererProps {
    blockId: string;
    blockType: string;
    blockVersion: number | string;
    data: any; // Replace 'any' with the actual shared or specific block data type
    // Add any other common props needed by renderers
}

// Define a fallback component for unknown or unsupported blocks
const UnknownBlockRenderer: React.FC<BlockRendererProps> = ({ blockType, blockVersion, data }) => {
    return (
        <div className= "block-renderer unknown-block" style = {{ border: '1px dashed red', padding: '10px', margin: '5px 0' }
}>
    <strong>Unknown / Unsupported Block </strong>
        < p > Type: { blockType }, Version: { blockVersion } </p>
            < details >
            <summary>Raw Data </summary>
                < pre style = {{ fontSize: '0.8em', backgroundColor: '#f0f0f0', padding: '5px' }}>
                    { JSON.stringify(data, null, 2) }
                    </pre>
                    </details>
                    </div>
  );
};

// Use a Map to store the dynamically loaded components
const rendererRegistry = new Map<string, ComponentType<any>>(); // Use 'any' for now, refine later

// Populate the registry using next/dynamic based on the manifest
for (const [key, relativePath] of Object.entries(rendererManifest)) {
    // Note: next/dynamic needs the import path to be statically analyzable.
    // We can't directly use a variable `relativePath` inside dynamic().
    // This approach using the manifest might require adjustments or a different strategy
    // if Next.js cannot resolve these dynamic imports based on the manifest structure.
    // A common alternative is to use a large switch statement or if/else chain
    // if the number of renderers isn't excessively large, or generate this file entirely.

    // For now, let's *attempt* dynamic loading, but be aware it might fail.
    // A safer, more standard Next.js approach would be needed if this doesn't work.
    try {
        // WARNING: This dynamic import pattern (`import(relativePath)`) might not work reliably
        // with Next.js build process. It depends heavily on how Webpack/Turbopack analyze it.
        const DynamicComponent = dynamic(() => import(`${relativePath}`), {
            // Optional: Add loading component
            // loading: () => <p>Loading renderer...</p>,
            ssr: false, // Example: Disable SSR if renderers are client-side only
        });
        rendererRegistry.set(key, DynamicComponent);
    } catch (error) {
        console.error(`Error loading dynamic component for key ${key} path ${relativePath}:`, error);
        // Keep registry entry undefined or null to indicate loading failure?
        // Or rely on the get function to handle missing entries.
    }

}
console.log(`Initialized block renderer registry with ${rendererRegistry.size} dynamic components.`);


// Function to get the appropriate renderer component
export function getRendererComponent(type: string, version: number | string): ComponentType<BlockRendererProps> {
    // Sanitize and format the type name as done in gen-renderers.ts
    const componentType = type.charAt(0).toUpperCase() + type.slice(1).replace(/[^a-zA-Z0-9]/g, '');
    const key = `${componentType}_v${version}`;

    const Renderer = rendererRegistry.get(key);

    if (Renderer) {
        // console.log(`Found renderer for key: ${key}`);
        return Renderer as ComponentType<BlockRendererProps>; // Cast needed due to initial 'any' type
    } else {
        // console.warn(`Renderer not found for key: ${key}. Using fallback.`);
        return UnknownBlockRenderer;
    }
}

// Example of how to use the registry in a parent component:
/*
import { getRendererComponent } from '../lib/blockRendererRegistry';

const BlockDisplay = ({ block }) => {
  const Renderer = getRendererComponent(block.type, block.version);

  // Consider adding error boundaries around each renderer
  return (
      <Renderer
          blockId={block.id}
          blockType={block.type}
          blockVersion={block.version}
          data={block.data}
      />
  );
};
*/

// Export the fallback component if needed elsewhere
export { UnknownBlockRenderer }; 