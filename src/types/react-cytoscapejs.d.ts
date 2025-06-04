declare module 'react-cytoscapejs' {
    import { Component } from 'react';

    interface CytoscapeComponentProps {
        elements: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
        style?: React.CSSProperties;
        stylesheet?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
        layout?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        cy?: (cy: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    class CytoscapeComponent extends Component<CytoscapeComponentProps> { }

    export default CytoscapeComponent;
} 