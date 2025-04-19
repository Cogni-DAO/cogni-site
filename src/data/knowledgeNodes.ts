
export interface KnowledgeNodeBlock {
  id: string;
  title: string;
  content: string;
  verificationPercentage: number;
  links: { title: string; slug: string }[];
}

export interface KnowledgeNode {
  id: string;
  title: string;
  slug: string;
  description: string;
  verificationPercentage: number;
  blocks: KnowledgeNodeBlock[];
  relatedNodes: string[]; // Array of node IDs
}

const knowledgeNodes: KnowledgeNode[] = [
  {
    id: "node-1",
    title: "Quantum Computing Fundamentals",
    slug: "quantum-computing-fundamentals",
    description: "An introduction to the basic principles of quantum computing and quantum mechanics.",
    verificationPercentage: 87,
    blocks: [
      {
        id: "block-1-1",
        title: "What is Quantum Computing?",
        content: "Quantum computing is a type of computation that harnesses quantum mechanical phenomena like superposition and entanglement to perform operations on data. Unlike classical computing that uses bits (0s and 1s), quantum computing uses quantum bits or qubits that can exist in multiple states simultaneously.",
        verificationPercentage: 95,
        links: [
          { title: "Superposition", slug: "quantum-superposition" },
          { title: "Quantum Entanglement", slug: "quantum-entanglement" },
          { title: "Qubits", slug: "quantum-bits" }
        ]
      },
      {
        id: "block-1-2",
        title: "Quantum vs. Classical Computing",
        content: "Classical computers use bits as the smallest unit of data, where each bit can be either 0 or 1. Quantum computers use qubits, which can be in a superposition of both 0 and 1 states simultaneously. This allows quantum computers to process a vastly higher number of possibilities simultaneously for certain types of problems.",
        verificationPercentage: 88,
        links: [
          { title: "Classical Computing", slug: "classical-computing" },
          { title: "Quantum Advantage", slug: "quantum-advantage" }
        ]
      },
      {
        id: "block-1-3",
        title: "Quantum Gates and Circuits",
        content: "Quantum circuits consist of a sequence of quantum gates, which are operations that manipulate qubits. Common quantum gates include the Hadamard gate (which creates superposition), the CNOT gate (which creates entanglement), and the Pauli gates (which perform rotations). Quantum algorithms are implemented using these gates.",
        verificationPercentage: 78,
        links: [
          { title: "Quantum Gates", slug: "quantum-gates" },
          { title: "Quantum Algorithms", slug: "quantum-algorithms" },
          { title: "Hadamard Transform", slug: "hadamard-transform" }
        ]
      }
    ],
    relatedNodes: ["node-2", "node-3", "node-5"]
  },
  {
    id: "node-2",
    title: "Quantum Superposition",
    slug: "quantum-superposition",
    description: "The quantum mechanical phenomenon where particles exist in multiple states simultaneously.",
    verificationPercentage: 92,
    blocks: [
      {
        id: "block-2-1",
        title: "Definition of Superposition",
        content: "In quantum mechanics, superposition refers to the ability of a quantum system to exist in multiple states simultaneously until it is measured or observed. This is one of the fundamental principles that distinguishes quantum mechanics from classical physics.",
        verificationPercentage: 98,
        links: [
          { title: "Wave Function", slug: "wave-function" },
          { title: "Quantum Measurement", slug: "quantum-measurement" }
        ]
      },
      {
        id: "block-2-2",
        title: "Mathematical Representation",
        content: "Superposition is mathematically represented as a linear combination of possible states. For a qubit, it can be written as |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes, and |α|² + |β|² = 1 to ensure total probability equals 1.",
        verificationPercentage: 85,
        links: [
          { title: "Dirac Notation", slug: "dirac-notation" },
          { title: "Hilbert Space", slug: "hilbert-space" }
        ]
      },
      {
        id: "block-2-3",
        title: "Implications and Applications",
        content: "Superposition enables quantum computers to process multiple possibilities simultaneously, leading to computational advantages for certain problems like factoring large numbers (Shor's algorithm) and searching unsorted databases (Grover's algorithm).",
        verificationPercentage: 93,
        links: [
          { title: "Shor's Algorithm", slug: "shors-algorithm" },
          { title: "Grover's Algorithm", slug: "grovers-algorithm" },
          { title: "Quantum Parallelism", slug: "quantum-parallelism" }
        ]
      }
    ],
    relatedNodes: ["node-1", "node-3", "node-7"]
  },
  {
    id: "node-3",
    title: "Quantum Entanglement",
    slug: "quantum-entanglement",
    description: "A quantum phenomenon where particles become correlated and the quantum state of each particle cannot be described independently.",
    verificationPercentage: 89,
    blocks: [
      {
        id: "block-3-1",
        title: "The Phenomenon of Entanglement",
        content: "Quantum entanglement occurs when pairs or groups of particles interact in such a way that the quantum state of each particle cannot be described independently of the state of the others. This is true even when the particles are separated by large distances - a phenomenon Einstein famously called 'spooky action at a distance.'",
        verificationPercentage: 94,
        links: [
          { title: "Bell's Theorem", slug: "bells-theorem" },
          { title: "EPR Paradox", slug: "epr-paradox" }
        ]
      },
      {
        id: "block-3-2",
        title: "Creating Entangled States",
        content: "Entangled states can be created through various quantum interactions. In quantum computing, entanglement is typically created using gates like the CNOT (controlled-NOT) gate, which flips the state of a target qubit conditional on the state of a control qubit.",
        verificationPercentage: 82,
        links: [
          { title: "CNOT Gate", slug: "cnot-gate" },
          { title: "Bell States", slug: "bell-states" }
        ]
      },
      {
        id: "block-3-3",
        title: "Applications of Entanglement",
        content: "Entanglement is a crucial resource for many quantum technologies, including quantum computing, quantum cryptography, and quantum teleportation. It enables secure communication through quantum key distribution protocols like BB84 and E91.",
        verificationPercentage: 91,
        links: [
          { title: "Quantum Cryptography", slug: "quantum-cryptography" },
          { title: "Quantum Teleportation", slug: "quantum-teleportation" },
          { title: "Quantum Key Distribution", slug: "quantum-key-distribution" }
        ]
      }
    ],
    relatedNodes: ["node-1", "node-2", "node-4"]
  },
  {
    id: "node-4",
    title: "Quantum Cryptography",
    slug: "quantum-cryptography",
    description: "The use of quantum mechanical properties to perform cryptographic tasks with unconditional security.",
    verificationPercentage: 76,
    blocks: [
      {
        id: "block-4-1",
        title: "Principles of Quantum Cryptography",
        content: "Quantum cryptography uses the principles of quantum mechanics to secure communication. Unlike classical cryptographic systems whose security relies on computational complexity, quantum cryptography offers security based on the fundamental laws of physics, specifically the no-cloning theorem and the uncertainty principle.",
        verificationPercentage: 88,
        links: [
          { title: "No-Cloning Theorem", slug: "no-cloning-theorem" },
          { title: "Uncertainty Principle", slug: "uncertainty-principle" }
        ]
      },
      {
        id: "block-4-2",
        title: "Quantum Key Distribution",
        content: "The most developed application of quantum cryptography is Quantum Key Distribution (QKD), which allows two parties to produce a shared random secret key known only to them. Any eavesdropping attempt introduces detectable errors in the system, alerting the communicating parties.",
        verificationPercentage: 79,
        links: [
          { title: "BB84 Protocol", slug: "bb84-protocol" },
          { title: "E91 Protocol", slug: "e91-protocol" },
          { title: "Quantum Key Distribution", slug: "quantum-key-distribution" }
        ]
      },
      {
        id: "block-4-3",
        title: "Challenges and Limitations",
        content: "While quantum cryptography offers theoretical unconditional security, practical implementations face challenges like quantum decoherence, limited transmission distances, and side-channel attacks that exploit physical implementation vulnerabilities rather than the protocol itself.",
        verificationPercentage: 61,
        links: [
          { title: "Quantum Decoherence", slug: "quantum-decoherence" },
          { title: "Side-Channel Attacks", slug: "side-channel-attacks" }
        ]
      }
    ],
    relatedNodes: ["node-3", "node-8"]
  },
  {
    id: "node-5",
    title: "Quantum Algorithms",
    slug: "quantum-algorithms",
    description: "Algorithms designed to run on quantum computers that provide advantages over classical algorithms.",
    verificationPercentage: 83,
    blocks: [
      {
        id: "block-5-1",
        title: "Introduction to Quantum Algorithms",
        content: "Quantum algorithms are designed to run on quantum computers and can solve certain problems more efficiently than the best-known classical algorithms. These algorithms leverage quantum phenomena like superposition, entanglement, and quantum interference to achieve computational speedups.",
        verificationPercentage: 90,
        links: [
          { title: "Quantum Speedup", slug: "quantum-speedup" },
          { title: "Quantum Interference", slug: "quantum-interference" }
        ]
      },
      {
        id: "block-5-2",
        title: "Key Quantum Algorithms",
        content: "Notable quantum algorithms include Shor's algorithm for factoring large integers (with implications for cryptography), Grover's algorithm for searching unstructured databases, and quantum simulation algorithms that model quantum systems more efficiently than classical computers.",
        verificationPercentage: 86,
        links: [
          { title: "Shor's Algorithm", slug: "shors-algorithm" },
          { title: "Grover's Algorithm", slug: "grovers-algorithm" },
          { title: "Quantum Simulation", slug: "quantum-simulation" }
        ]
      },
      {
        id: "block-5-3",
        title: "Recent Developments",
        content: "Recent advancements include the Variational Quantum Eigensolver (VQE) and Quantum Approximate Optimization Algorithm (QAOA), which are hybrid quantum-classical algorithms designed for near-term quantum computers with limited qubit counts and high error rates.",
        verificationPercentage: 72,
        links: [
          { title: "NISQ Era Computing", slug: "nisq-era-computing" },
          { title: "Variational Quantum Algorithms", slug: "variational-quantum-algorithms" },
          { title: "Quantum Machine Learning", slug: "quantum-machine-learning" }
        ]
      }
    ],
    relatedNodes: ["node-1", "node-6", "node-7"]
  },
  {
    id: "node-6",
    title: "Artificial Neural Networks",
    slug: "artificial-neural-networks",
    description: "Computational models inspired by the human brain's neural structure for machine learning applications.",
    verificationPercentage: 94,
    blocks: [
      {
        id: "block-6-1",
        title: "Neural Network Basics",
        content: "Artificial Neural Networks (ANNs) are computing systems inspired by biological neural networks in human brains. They consist of connected nodes (neurons) organized in layers, including input layers, hidden layers, and output layers. Each connection can transmit a signal from one neuron to another.",
        verificationPercentage: 97,
        links: [
          { title: "Neurons", slug: "artificial-neurons" },
          { title: "Activation Functions", slug: "activation-functions" },
          { title: "Network Architectures", slug: "neural-network-architectures" }
        ]
      },
      {
        id: "block-6-2",
        title: "Training Neural Networks",
        content: "Neural networks learn by adjusting the weights of connections between neurons. This training typically uses backpropagation with gradient descent, where the network computes the gradient of a loss function with respect to its parameters and updates them to minimize the loss.",
        verificationPercentage: 92,
        links: [
          { title: "Backpropagation", slug: "backpropagation" },
          { title: "Gradient Descent", slug: "gradient-descent" },
          { title: "Loss Functions", slug: "loss-functions" }
        ]
      },
      {
        id: "block-6-3",
        title: "Types and Applications",
        content: "Common types include Feedforward Neural Networks, Convolutional Neural Networks (CNNs) for image processing, Recurrent Neural Networks (RNNs) for sequential data, and Transformers for natural language processing. Applications span computer vision, speech recognition, natural language processing, and more.",
        verificationPercentage: 94,
        links: [
          { title: "Convolutional Networks", slug: "convolutional-neural-networks" },
          { title: "Recurrent Networks", slug: "recurrent-neural-networks" },
          { title: "Transformer Models", slug: "transformer-models" }
        ]
      }
    ],
    relatedNodes: ["node-7", "node-8"]
  },
  {
    id: "node-7",
    title: "Quantum Machine Learning",
    slug: "quantum-machine-learning",
    description: "The intersection of quantum computing and machine learning, exploring how quantum algorithms can enhance machine learning tasks.",
    verificationPercentage: 65,
    blocks: [
      {
        id: "block-7-1",
        title: "Introduction to Quantum Machine Learning",
        content: "Quantum Machine Learning (QML) explores how quantum computing can be used to enhance machine learning algorithms. It leverages quantum properties to potentially achieve speedups for specific machine learning tasks or to process data with quantum characteristics that classical computers struggle with.",
        verificationPercentage: 78,
        links: [
          { title: "Quantum Computing", slug: "quantum-computing-fundamentals" },
          { title: "Machine Learning", slug: "artificial-neural-networks" }
        ]
      },
      {
        id: "block-7-2",
        title: "Quantum Neural Networks",
        content: "Quantum Neural Networks (QNNs) are quantum circuits designed with a neural network structure. They use parameterized quantum gates whose parameters are optimized during training, similar to weights in classical neural networks. QNNs can potentially model complex quantum data more efficiently than classical neural networks.",
        verificationPercentage: 59,
        links: [
          { title: "Parametrized Quantum Circuits", slug: "parametrized-quantum-circuits" },
          { title: "Quantum Backpropagation", slug: "quantum-backpropagation" }
        ]
      },
      {
        id: "block-7-3",
        title: "Current Challenges and Research",
        content: "QML faces challenges including limited qubit counts, quantum decoherence, and the need for quantum-classical interfaces. Active research areas include designing quantum kernels for support vector machines, quantum reinforcement learning, and developing quantum versions of classical machine learning algorithms.",
        verificationPercentage: 58,
        links: [
          { title: "Quantum Kernels", slug: "quantum-kernels" },
          { title: "Quantum Reinforcement Learning", slug: "quantum-reinforcement-learning" },
          { title: "Quantum Advantage in ML", slug: "quantum-advantage-in-ml" }
        ]
      }
    ],
    relatedNodes: ["node-5", "node-6"]
  },
  {
    id: "node-8",
    title: "Cybersecurity Fundamentals",
    slug: "cybersecurity-fundamentals",
    description: "Core principles, practices, and technologies for protecting systems, networks, and data from digital attacks.",
    verificationPercentage: 91,
    blocks: [
      {
        id: "block-8-1",
        title: "Core Cybersecurity Concepts",
        content: "Cybersecurity revolves around protecting the confidentiality, integrity, and availability of information systems and data. It involves understanding threat models, risk assessment, and implementing controls to prevent, detect, and respond to security breaches and cyberattacks.",
        verificationPercentage: 96,
        links: [
          { title: "CIA Triad", slug: "cia-triad" },
          { title: "Threat Modeling", slug: "threat-modeling" },
          { title: "Risk Assessment", slug: "risk-assessment" }
        ]
      },
      {
        id: "block-8-2",
        title: "Security Controls and Best Practices",
        content: "Effective security implementations use layered defenses ('defense in depth') including technical controls (firewalls, encryption, authentication systems), administrative controls (policies, procedures, training), and physical controls (facility security, device protection).",
        verificationPercentage: 94,
        links: [
          { title: "Defense in Depth", slug: "defense-in-depth" },
          { title: "Access Control", slug: "access-control" },
          { title: "Security Policies", slug: "security-policies" }
        ]
      },
      {
        id: "block-8-3",
        title: "Emerging Threats and Defenses",
        content: "The cybersecurity landscape constantly evolves with new threats like advanced persistent threats (APTs), ransomware, and supply chain attacks. Modern defenses increasingly use artificial intelligence, automation, and threat intelligence to identify and respond to sophisticated attacks.",
        verificationPercentage: 82,
        links: [
          { title: "Advanced Persistent Threats", slug: "advanced-persistent-threats" },
          { title: "Ransomware", slug: "ransomware" },
          { title: "Security Automation", slug: "security-automation" },
          { title: "Quantum Cryptography", slug: "quantum-cryptography" }
        ]
      }
    ],
    relatedNodes: ["node-4", "node-6"]
  }
];

export const getKnowledgeNodes = () => knowledgeNodes;

export const getKnowledgeNodeBySlug = (slug: string) => {
  return knowledgeNodes.find(node => node.slug === slug);
};

export const getRelatedKnowledgeNodes = (nodeIds: string[]) => {
  return knowledgeNodes.filter(node => nodeIds.includes(node.id));
};

export const getFeaturedKnowledgeNodes = (count: number = 3) => {
  // In a real application, this might use more sophisticated criteria
  return knowledgeNodes
    .sort((a, b) => b.verificationPercentage - a.verificationPercentage)
    .slice(0, count);
};
