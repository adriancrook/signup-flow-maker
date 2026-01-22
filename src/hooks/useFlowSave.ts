import { useState, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { flowService } from "@/services/flowService";

export function useFlowSave() {
    const [isSaving, setIsSaving] = useState(false);
    const {
        getFlowJson,
        markClean,
        setFlow,
        currentFlow
    } = useEditorStore();

    const saveFlow = useCallback(async () => {
        setIsSaving(true);
        try {
            // Need to get the full flow object with latest state
            const flowJson = getFlowJson();
            if (!flowJson) return;

            const flow = JSON.parse(flowJson);

            // UUID Regex Check
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(flow.id);

            if (isUuid) {
                // Existing Database Flow -> Update
                await flowService.saveFlow(flow);
                console.log("Flow saved to database successfully.");
            } else {
                // New/Template Flow -> Create New
                const newId = await flowService.createFlow(flow);

                // Update local state with the new ID so future saves are updates
                // This also ensures the URL could technically be updated, but for now we just keep working
                const updatedFlow = { ...flow, id: newId };
                setFlow(updatedFlow);

                console.log("New flow created and saved to database:", newId);

                // Optional: Update URL without reload (if we want deep linking to persist)
                window.history.replaceState(null, "", `/editor/${newId}`);
            }

            markClean();
            return true;
        } catch (error) {
            console.error("Failed to save flow:", error);
            // alert("Failed to save flow to database."); // Optional: remove alert for auto-saves or handle via toast
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [getFlowJson, markClean, setFlow]);

    return {
        saveFlow,
        isSaving
    };
}
