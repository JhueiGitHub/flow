import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DesignSystemForm from "./DesignSystemForm";
import ActiveDesignSystem from "./ActiveDesignSystem";
import DesignSystemDropdown from "./DesignSystemDropdown";
import { DesignSystem } from "@prisma/client";

interface FlowAppLayoutProps {
  designSystems: DesignSystem[];
  activeDesignSystem: DesignSystem | null;
  onCreateDesignSystem: (newSystem: Partial<DesignSystem>) => Promise<void>;
  onUpdateDesignSystem: (updatedSystem: DesignSystem) => Promise<void>;
  onActivateDesignSystem: (system: DesignSystem) => Promise<void>;
  onDeleteDesignSystem: (id: string) => Promise<void>;
  onExportDesignSystem: (id: string) => Promise<void>;
}

const FlowAppLayout: React.FC<FlowAppLayoutProps> = ({
  designSystems,
  activeDesignSystem,
  onCreateDesignSystem,
  onUpdateDesignSystem,
  onActivateDesignSystem,
  onDeleteDesignSystem,
  onExportDesignSystem,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-black bg-opacity-80 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">FLOW</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New Design System
        </motion.button>

        <DesignSystemDropdown
          systems={designSystems}
          activeSystemId={activeDesignSystem?.id}
          onActivate={onActivateDesignSystem}
          onDelete={onDeleteDesignSystem}
          onExport={onExportDesignSystem}
        />

        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DesignSystemForm
                onSubmit={onCreateDesignSystem}
                onCancel={() => setShowCreateForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {activeDesignSystem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ActiveDesignSystem
              system={activeDesignSystem}
              onUpdate={onUpdateDesignSystem}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlowAppLayout;
