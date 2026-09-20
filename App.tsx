import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ToolsAccordion } from './components/ToolsAccordion';
import { Modal } from './components/common/Modal';
import { GuidebookModal } from './components/GuidebookModal';
import { SystemInstructionModal } from './components/SystemInstructionModal';
import { LLMProviderModal } from './components/LLMProviderModal';
import { Project, Prompt, Tool, SystemInstruction, LLMSettings, KnowledgeItem, LLMStatusMonitorState, HyperExpertSettings } from './types';
import { INITIAL_PROJECTS } from './constants';
import {
  loadSystemInstructions,
  saveSystemInstructions,
} from './services/systemInstructionStorage';
import {
  loadLLMSettings,
  saveLLMSettings,
} from './services/llmStorage';
import {
  loadKnowledgeList,
  saveKnowledgeList,
} from './services/knowledgeStorage';
import {
  loadHyperExpertSettings,
  saveHyperExpertSettings,
} from './services/hyperExpertService';

type ActiveView = 'dashboard' | 'editor';

const PROJECTS_STORAGE_KEY = 'ai_orchestrator_projects_list';

const loadProjectsWithPresets = (): Project[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed: Project[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_PROJECTS;

    // Merge missing projects or updated preset prompts/workflows
    const updated = parsed.map(project => {
      const preset = INITIAL_PROJECTS.find(p => p.id === project.id);
      if (!preset) return project;
      
      const existingPromptIds = new Set(project.prompts.map(pr => pr.id));
      const missingPrompts = preset.prompts.filter(pr => !existingPromptIds.has(pr.id));
      
      const existingWorkflowIds = new Set((project.workflows || []).map(wf => wf.id));
      const missingWorkflows = (preset.workflows || []).filter(wf => !existingWorkflowIds.has(wf.id));

      if (missingPrompts.length > 0 || missingWorkflows.length > 0) {
        return {
          ...project,
          prompts: [...missingPrompts, ...project.prompts],
          workflows: [...(project.workflows || []), ...missingWorkflows],
        };
      }
      return project;
    });

    const existingIds = new Set(updated.map(p => p.id));
    const missingPresets = INITIAL_PROJECTS.filter(p => !existingIds.has(p.id));
    const merged = missingPresets.length > 0 ? [...updated, ...missingPresets] : updated;

    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return INITIAL_PROJECTS;
  }
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => loadProjectsWithPresets());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const initial = loadProjectsWithPresets();
    return initial[0]?.id || null;
  });
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [guidebookInitialTab, setGuidebookInitialTab] = useState<'knowledgeBase' | 'localLlm' | 'creativePipeline' | 'techFunnel' | 'harmFunnel' | 'appUsage' | 'githubReadme' | 'llmIntegration' | 'systemInstruction' | 'loveMarketing'>('knowledgeBase');
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Knowledge Base State
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>(() => loadKnowledgeList());

  // System Instructions State
  const [instructions, setInstructions] = useState<SystemInstruction[]>(() => loadSystemInstructions());
  const [activeInstructionId, setActiveInstructionId] = useState<string | null>(() => {
    const loaded = loadSystemInstructions();
    return loaded[0]?.id || null;
  });

  // LLM Providers & Settings State
  const [llmSettings, setLlmSettings] = useState<LLMSettings>(() => loadLLMSettings());

  // Hyper-Dimensional Expert (PATH Cognitive OS) State
  const [hyperExpertSettings, setHyperExpertSettings] = useState<HyperExpertSettings>(() => loadHyperExpertSettings());

  const handleUpdateHyperExpertSettings = (newSettings: HyperExpertSettings) => {
    setHyperExpertSettings(newSettings);
    saveHyperExpertSettings(newSettings);
  };

  // Constant Live Status Monitor State (極小ステータスモニター)
  const [llmStatus, setLlmStatus] = useState<LLMStatusMonitorState>(() => {
    const activeP = llmSettings.providers[llmSettings.activeProvider] || llmSettings.providers.gemini;
    return {
      status: 'idle',
      providerId: llmSettings.activeProvider,
      providerName: activeP.name,
      model: activeP.selectedModel,
      connectionMode: activeP.connectionMode || 'direct',
      endpoint: activeP.baseUrl || '',
      characterCount: 0,
      isGeminiIsolated: llmSettings.activeProvider !== 'gemini',
      lastUpdated: Date.now(),
    };
  });

  // Sync monitor state when active provider or provider settings change
  useEffect(() => {
    const activeP = llmSettings.providers[llmSettings.activeProvider] || llmSettings.providers.gemini;
    setLlmStatus(prev => ({
      ...prev,
      providerId: llmSettings.activeProvider,
      providerName: activeP.name,
      model: activeP.selectedModel,
      connectionMode: activeP.connectionMode || 'direct',
      endpoint: activeP.baseUrl || '',
      isGeminiIsolated: llmSettings.activeProvider !== 'gemini',
      lastUpdated: Date.now(),
    }));
  }, [llmSettings.activeProvider, llmSettings.providers]);

  const handleStatusUpdate = (partialStatus: Partial<LLMStatusMonitorState>) => {
    setLlmStatus(prev => ({
      ...prev,
      ...partialStatus,
      lastUpdated: Date.now(),
    }));
  };

  // Keep localStorage in sync with projects
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to sync projects to localStorage', e);
    }
  }, [projects]);

  // Keep localStorage in sync with knowledge base
  useEffect(() => {
    saveKnowledgeList(knowledgeList);
  }, [knowledgeList]);

  // Keep localStorage in sync with instructions
  useEffect(() => {
    saveSystemInstructions(instructions);
  }, [instructions]);

  // Keep localStorage in sync with LLM settings
  useEffect(() => {
    saveLLMSettings(llmSettings);
  }, [llmSettings]);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const activeInstruction = instructions.find(i => i.id === activeInstructionId) || null;

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setActivePrompt(null);
    setActiveView('dashboard');
    const selectedProj = projects.find(p => p.id === id);
    if (selectedProj?.defaultSystemInstructionId) {
      setActiveInstructionId(selectedProj.defaultSystemInstructionId);
    }
  };
  
  const handleSelectPrompt = (prompt: Prompt) => {
    setActivePrompt(prompt);
    if (prompt.systemInstructionId) {
      setActiveInstructionId(prompt.systemInstructionId);
    }
    setActiveView('editor');
  };
  
  const handleSelectTool = (tool: Tool) => {
    setActivePrompt(tool as Prompt);
    setActiveView('editor');
  };

  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    if (!activeProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          prompts: p.prompts.map(prompt => prompt.id === updatedPrompt.id ? updatedPrompt : prompt),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    setActivePrompt(updatedPrompt);
  };
  
  const handleCreateNewProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: newProjectTitle.trim(),
        description: newProjectDescription.trim(),
        prompts: [],
        workflows: [],
        defaultSystemInstructionId: activeInstructionId || undefined,
    };
    setProjects([...projects, newProject]);
    setNewProjectTitle('');
    setNewProjectDescription('');
    setIsModalOpen(false);
    setActiveProjectId(newProject.id);
    setActiveView('dashboard');
  };

  const handleCreatePrompt = () => {
     if (!activeProject) return;
     const newPrompt: Prompt = {
         id: `p-${Date.now()}`,
         title: '名称未設定の新規プロンプト',
         content: '',
         tags: [],
         systemInstructionId: activeInstructionId || undefined,
     };
     const updatedProjects = projects.map(p => {
         if (p.id === activeProject.id) {
             return { ...p, prompts: [...p.prompts, newPrompt] };
         }
         return p;
     });
     setProjects(updatedProjects);
     setActivePrompt(newPrompt);
     setActiveView('editor');
  };

  const handleClonePrompt = (promptId: string) => {
    if (!activeProject) return;
    const promptToClone = activeProject.prompts.find(p => p.id === promptId);
    if (!promptToClone) return;

    const newPrompt: Prompt = {
        ...promptToClone,
        id: `p-${Date.now()}`,
        title: `${promptToClone.title} (コピー)`
    };

    const updatedProjects = projects.map(p => {
         if (p.id === activeProject.id) {
             return { ...p, prompts: [...p.prompts, newPrompt] };
         }
         return p;
     });
     setProjects(updatedProjects);
     setActivePrompt(newPrompt);
     setActiveView('editor');
  };

  // Knowledge Handlers
  const handleSaveKnowledge = (item: KnowledgeItem) => {
    setKnowledgeList(prev => {
      const idx = prev.findIndex(k => k.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteKnowledge = (id: string) => {
    setKnowledgeList(prev => prev.filter(k => k.id !== id));
  };

  const handleResetKnowledge = (items: KnowledgeItem[]) => {
    setKnowledgeList(items);
  };

  const handleOpenKnowledgeModal = () => {
    setGuidebookInitialTab('knowledgeBase');
    setIsGuidebookOpen(true);
  };

  // System Instruction handlers
  const handleSelectInstruction = (instruction: SystemInstruction) => {
    setActiveInstructionId(instruction.id);
  };

  const handleSaveInstruction = (instruction: SystemInstruction) => {
    setInstructions(prev => {
      const idx = prev.findIndex(i => i.id === instruction.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = instruction;
        return next;
      }
      return [instruction, ...prev];
    });
    setActiveInstructionId(instruction.id);
  };

  const handleDeleteInstruction = (id: string) => {
    setInstructions(prev => prev.filter(i => i.id !== id));
    if (activeInstructionId === id) {
      const remaining = instructions.filter(i => i.id !== id);
      setActiveInstructionId(remaining[0]?.id || null);
    }
  };

  const handleResetInstructions = (newInstructions: SystemInstruction[]) => {
    setInstructions(newInstructions);
    if (newInstructions.length > 0) {
      setActiveInstructionId(newInstructions[0].id);
    }
  };

  // LLM Settings Handlers
  const handleUpdateLLMSettings = (newSettings: LLMSettings) => {
    setLlmSettings(newSettings);
  };

  return (
    <div className="flex h-screen w-screen text-gray-200 bg-gray-900 overflow-hidden font-sans">
      <Sidebar 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={() => setIsModalOpen(true)}
        onOpenGuidebook={() => {
          setGuidebookInitialTab('knowledgeBase');
          setIsGuidebookOpen(true);
        }}
        onOpenReadme={() => {
          setGuidebookInitialTab('githubReadme');
          setIsGuidebookOpen(true);
        }}
        onOpenLocalLlmGuide={() => {
          setGuidebookInitialTab('localLlm');
          setIsGuidebookOpen(true);
        }}
        onOpenCreativePipeline={() => {
          setGuidebookInitialTab('creativePipeline');
          setIsGuidebookOpen(true);
        }}
        onOpenInstructions={() => setIsInstructionsModalOpen(true)}
        onOpenLLMSettings={() => setIsLLMModalOpen(true)}
        activeInstruction={activeInstruction}
        llmSettings={llmSettings}
        knowledgeCount={knowledgeList.length}
      />
      <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden relative">
        <MainContent 
          activeProject={activeProject} 
          activePrompt={activePrompt}
          activeView={activeView}
          setActiveView={setActiveView}
          onSelectPrompt={handleSelectPrompt}
          onUpdatePrompt={handleUpdatePrompt}
          onCreatePrompt={handleCreatePrompt}
          onClonePrompt={handleClonePrompt}
          instructions={instructions}
          activeInstructionId={activeInstructionId}
          onSelectInstructionId={setActiveInstructionId}
          onOpenInstructionsModal={() => setIsInstructionsModalOpen(true)}
          llmSettings={llmSettings}
          onOpenLLMSettings={() => setIsLLMModalOpen(true)}
          onUpdateLLMSettings={handleUpdateLLMSettings}
          knowledgeList={knowledgeList}
          onOpenKnowledgeModal={handleOpenKnowledgeModal}
          monitorState={llmStatus}
          onStatusUpdate={handleStatusUpdate}
          hyperExpertSettings={hyperExpertSettings}
          onUpdateHyperExpertSettings={handleUpdateHyperExpertSettings}
        />
        <ToolsAccordion onSelectTool={handleSelectTool} />
      </div>

      {/* New Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新規プロジェクト作成">
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">プロジェクト名</label>
                <input 
                    type="text" 
                    value={newProjectTitle}
                    onChange={e => setNewProjectTitle(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-md border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例：Q3 コンテンツ戦略"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">説明</label>
                <textarea 
                    value={newProjectDescription}
                    onChange={e => setNewProjectDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-700 text-white rounded-md border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="プロジェクトの目的を簡単に入力してください。"
                />
            </div>
            <div className="flex justify-end">
                <button 
                    onClick={handleCreateNewProject}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                    プロジェクトを作成
                </button>
            </div>
         </div>
      </Modal>

      {/* Guidebook & Knowledge Base Modal */}
      <GuidebookModal
        isOpen={isGuidebookOpen}
        onClose={() => setIsGuidebookOpen(false)}
        knowledgeList={knowledgeList}
        onSaveKnowledge={handleSaveKnowledge}
        onDeleteKnowledge={handleDeleteKnowledge}
        onResetKnowledge={handleResetKnowledge}
        initialTab={guidebookInitialTab}
      />

      {/* System Instruction Manager Modal */}
      <SystemInstructionModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        instructions={instructions}
        selectedId={activeInstructionId}
        onSelect={handleSelectInstruction}
        onSaveInstruction={handleSaveInstruction}
        onDeleteInstruction={handleDeleteInstruction}
        onResetInstructions={handleResetInstructions}
      />

      {/* LLM Provider & Local PC Integration Modal */}
      <LLMProviderModal
        isOpen={isLLMModalOpen}
        onClose={() => setIsLLMModalOpen(false)}
        settings={llmSettings}
        onUpdateSettings={handleUpdateLLMSettings}
      />
    </div>
  );
};

export default App;
