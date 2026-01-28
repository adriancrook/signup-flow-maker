import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Plus, X } from "lucide-react";

// Smart Combobox that shows full list on click/focus
function SmartCombobox({
    value,
    onCommit,
    options = [],
    isLocked,
    className,
    placeholder
}: {
    value: string;
    onCommit: (newVal: string) => void;
    options?: string[];
    isLocked: boolean;
    className?: string;
    placeholder?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [localValue, setLocalValue] = React.useState(value);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Sync external value
    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Click outside handler
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
                // Commit on blur/outside click
                if (localValue !== value) {
                    onCommit(localValue);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [localValue, value, onCommit]);

    const handleSelect = (opt: string) => {
        setLocalValue(opt);
        onCommit(opt);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onCommit(localValue);
            setOpen(false);
            (e.currentTarget as HTMLElement).blur();
        }
    };

    // Filter options based on localValue ONLY if the user is actively typing?
    // Actually simplicity: Show all options if open via button.
    // If open via focus, show filtering?
    // User requested "don't make me delete 'new' to see dropdown".
    // So we should show ALL options always when the dropdown is open? Or maybe filter only if it strictly matches nothing?
    // Let's go with: Show ALL options always for now, to ensure visibility.
    // OR: Standard combobox behavior: matches.
    // BUT: "new" might not match "student".
    // COMPROMISE: If the current value is "new" (the default), show ALL options.
    // If user types "st", show "student".

    const isDefaultValue = localValue.startsWith("new");
    const filteredOptions = isDefaultValue || localValue === ""
        ? options
        : options.filter(o => o.toLowerCase().includes(localValue.toLowerCase()));

    // Fallback: If filtering creates empty list, show all options (so users don't get stuck)
    const displayOptions = filteredOptions.length > 0 ? filteredOptions : options;

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <Input
                    value={localValue}
                    onChange={(e) => {
                        setLocalValue(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={`${className} pr-8`}
                    placeholder={placeholder}
                    disabled={isLocked}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-2 text-gray-400 hover:text-blue-500"
                    onClick={() => setOpen(!open)}
                    disabled={isLocked}
                    tabIndex={-1}
                >
                    <ChevronDown size={14} />
                </Button>
            </div>

            {open && options.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-blue-100 rounded-md shadow-lg max-h-60 overflow-auto">
                    {displayOptions.map((opt) => (
                        <div
                            key={opt}
                            className="px-3 py-2 text-xs text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleSelect(opt)}
                        >
                            {opt}
                        </div>
                    ))}
                    {displayOptions.length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-400 italic">No matches</div>
                    )}
                </div>
            )}
        </div>
    );
}

export interface SmartVariantsSectionProps {
    isLocked: boolean;
    variantKeys: string[];
    activeVariable: string;
    defaultVariant?: string;
    onUpdateVariable: (val: string) => void;
    onUpdateDefaultVariant: (val: string) => void;
    onAddVariant?: () => void;
    onRemoveVariant: (key: string) => void;
    onRenameVariant?: (oldKey: string, newKey: string) => void;
    renderVariantContent: (key: string) => React.ReactNode;
    variableLabel?: string;
    variablePlaceholder?: string;
    sectionTitle?: string;
    availableVariables?: string[];
    variableValues?: Record<string, string[]>;
    minimal?: boolean;
}

export function SmartVariantsSection({
    isLocked,
    variantKeys,
    activeVariable,
    defaultVariant,
    onUpdateVariable,
    onUpdateDefaultVariant,
    onAddVariant,
    onRemoveVariant,
    onRenameVariant,
    renderVariantContent,
    variableLabel = "Watch Variable",
    variablePlaceholder = "e.g. purpose1",
    sectionTitle = "Smart Messaging",
    availableVariables = [],
    variableValues,
    minimal = false
}: SmartVariantsSectionProps) {

    const currentVariableValues = (activeVariable && variableValues && variableValues[activeVariable]) || [];

    if (minimal) {
        return (
            <div className="space-y-2">
                {/* Datalists for Minimal Mode */}
                <datalist id="available-variables">
                    {availableVariables.map(v => {
                        const values = variableValues?.[v];
                        const label = values && values.length > 0 ? `Values: ${values.join(', ')}` : undefined;
                        return <option key={v} value={v} label={label}>{label}</option>;
                    })}
                </datalist>

                {currentVariableValues && currentVariableValues.length > 0 && (
                    <datalist id={`values-${activeVariable}`}>
                        {currentVariableValues.map(v => (
                            <option key={v} value={v} />
                        ))}
                    </datalist>
                )}

                {/* Rules List - Minimal (Flattened) */}
                <div className="space-y-2 mt-2">
                    {variantKeys.map((key, index) => (
                        <div key={`variant-${index}`} className="relative">
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <span className="text-xs font-bold text-blue-600 whitespace-nowrap">And if</span>
                                <Input
                                    list="available-variables"
                                    value={activeVariable}
                                    onChange={(e) => onUpdateVariable(e.target.value)}
                                    className="h-6 w-28 text-xs bg-white border-blue-200 focus-visible:ring-blue-400"
                                    placeholder="variable"
                                    disabled={isLocked}
                                />
                                <span className="text-xs font-bold text-blue-600 whitespace-nowrap">=</span>
                                <div className="flex-1">
                                    <SmartCombobox
                                        value={key}
                                        onCommit={(newVal) => onRenameVariant && onRenameVariant(key, newVal)}
                                        isLocked={isLocked || !onRenameVariant}
                                        className="h-6 text-xs font-medium border-blue-200 text-blue-900"
                                        placeholder="Value"
                                        options={currentVariableValues}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => onRemoveVariant(key)}
                                    disabled={isLocked}
                                >
                                    <X size={12} />
                                </Button>
                            </div>

                            {/* Content Body */}
                            <div className="">
                                {renderVariantContent(key)}
                            </div>
                        </div>
                    ))}

                    {/* Add AND IF button */}
                    {onAddVariant && !isLocked && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-7 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-200"
                            onClick={onAddVariant}
                        >
                            <Plus size={12} className="mr-1" />
                            Add AND IF condition
                        </Button>
                    )}
                </div>
            </div>
        );

    }

    // Standard Layout
    return (
        <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50/30 p-4">
            {/* Header: Title + Default Match (floated right) */}
            <div className="flex items-center justify-between border-b border-blue-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-blue-900">
                        {sectionTitle}
                    </Label>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-blue-400 font-medium">Else:</span>
                    <select
                        value={defaultVariant || "default"}
                        onChange={(e) => onUpdateDefaultVariant(e.target.value)}
                        className="h-6 w-32 rounded-md border border-blue-200 bg-white px-2 py-0 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        disabled={isLocked}
                    >
                        <option value="default">Original Content</option>
                        {variantKeys.map(key => (
                            <option key={key} value={key}>Use &quot;{key}&quot;</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Datalists */}
            <datalist id="available-variables">
                {availableVariables.map(v => {
                    const values = variableValues?.[v];
                    const label = values && values.length > 0 ? `Values: ${values.join(', ')}` : undefined;
                    return <option key={v} value={v} label={label}>{label}</option>;
                })}
            </datalist>

            <div className="space-y-3 pt-2">
                {variantKeys.map((key, index) => (
                    <div key={`variant-${index}`} className="bg-white rounded-md border border-blue-100 shadow-sm overflow-hidden">
                        {/* Logic Header: "If [var] matches [value]" */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 border-b border-blue-100">
                            <span className="text-xs font-bold text-blue-600">If</span>
                            <Input
                                list="available-variables"
                                value={activeVariable}
                                onChange={(e) => onUpdateVariable(e.target.value)}
                                className="h-6 w-28 text-xs bg-white border-blue-200 focus-visible:ring-blue-400"
                                placeholder="variable"
                                disabled={isLocked}
                            />
                            <span className="text-xs font-bold text-blue-600">=</span>
                            <div className="flex-1">
                                <SmartCombobox
                                    value={key}
                                    onCommit={(newVal) => onRenameVariant && onRenameVariant(key, newVal)}
                                    isLocked={isLocked || !onRenameVariant}
                                    className="h-6 text-xs font-medium border-blue-200 text-blue-900"
                                    placeholder="value"
                                    options={currentVariableValues}
                                // listId REMOVED since we use options now!
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                onClick={() => onRemoveVariant(key)}
                                disabled={isLocked}
                            >
                                <X size={12} />
                            </Button>
                        </div>

                        {/* Content Body */}
                        <div className="p-3">
                            {renderVariantContent(key)}
                        </div>
                    </div>
                ))}

                {variantKeys.length === 0 && (
                    <div className="text-center p-6 border border-dashed border-blue-200 rounded-md bg-white/50">
                        <p className="text-xs text-blue-400">No logic rules added yet.</p>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => onAddVariant && onAddVariant()}
                            className="h-auto px-0 text-xs text-blue-600 underline"
                            disabled={isLocked}
                        >
                            + Add Rule
                        </Button>
                    </div>
                )}

                {/* Floating Add Rule Button (Bottom) */}
                {variantKeys.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddVariant && onAddVariant()}
                        className="text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 pl-0 ml-1"
                        disabled={isLocked}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Rule
                    </Button>
                )}
            </div>
        </div>
    );
}
