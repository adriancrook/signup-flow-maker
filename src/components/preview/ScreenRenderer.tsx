"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  Screen,
  QuestionScreen,
  MultiSelectScreen,
  GatekeeperScreen,
  InputScreen,
  SocialProofScreen,
  InterstitialScreen,
  DiscoveryScreen,
  AccountCreationScreen,
  SSOHandoffScreen,
  PaywallScreen,
  TypingTestScreen,
} from "@/types/flow";

interface ScreenRendererProps {
  screen: Screen;
  variables: Record<string, string | number | boolean | string[]>;
  onSetVariable: (name: string, value: string | number | boolean | string[]) => void;
  onNext: (selectedValue?: string, targetScreenId?: string) => void;
}

export function ScreenRenderer({
  screen,
  variables,
  onSetVariable,
  onNext,
}: ScreenRendererProps) {
  // Interpolate variables in text
  const interpolate = (text: string): string => {
    return text.replace(/\[(\w+)\]/g, (_, varName) => {
      const value = variables[varName];
      if (value === undefined) return `[${varName}]`;
      return Array.isArray(value) ? value.join(", ") : String(value);
    });
  };

  switch (screen.type) {
    case "gatekeeper":
    case "question":
    case "discovery":
      return (
        <QuestionRenderer
          screen={screen as QuestionScreen | GatekeeperScreen | DiscoveryScreen}
          interpolate={interpolate}
          onSetVariable={onSetVariable}
          onNext={onNext}
        />
      );

    case "multi-select":
      return (
        <MultiSelectRenderer
          screen={screen as MultiSelectScreen}
          interpolate={interpolate}
          onSetVariable={onSetVariable}
          onNext={onNext}
        />
      );

    case "input":
      return (
        <InputRenderer
          screen={screen as InputScreen}
          interpolate={interpolate}
          onSetVariable={onSetVariable}
          onNext={onNext}
        />
      );

    case "social-proof":
      return (
        <SocialProofRenderer
          screen={screen as SocialProofScreen}
          variables={variables}
          interpolate={interpolate}
          onNext={onNext}
        />
      );

    case "interstitial":
      return (
        <InterstitialRenderer
          screen={screen as InterstitialScreen}
          interpolate={interpolate}
          onNext={onNext}
        />
      );

    case "account-creation":
      return (
        <AccountCreationRenderer
          screen={screen as AccountCreationScreen}
          interpolate={interpolate}
          onNext={onNext}
        />
      );

    case "sso-handoff":
      return (
        <SSOHandoffRenderer
          screen={screen as SSOHandoffScreen}
          interpolate={interpolate}
        />
      );

    case "paywall":
      return (
        <PaywallRenderer
          screen={screen as PaywallScreen}
          interpolate={interpolate}
          onNext={onNext}
        />
      );

    case "typing-test":
      return (
        <TypingTestRenderer
          screen={screen as TypingTestScreen}
          interpolate={interpolate}
          onSetVariable={onSetVariable}
          onNext={onNext}
        />
      );

    default:
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">
            Preview not available for screen type: {screen.type}
          </p>
          <Button className="mt-4" onClick={() => onNext()}>
            Continue
          </Button>
        </div>
      );
  }
}

// Question Renderer
function QuestionRenderer({
  screen,
  interpolate,
  onSetVariable,
  onNext,
}: {
  screen: QuestionScreen | GatekeeperScreen | DiscoveryScreen;
  interpolate: (text: string) => string;
  onSetVariable: (name: string, value: string) => void;
  onNext: (value?: string, targetScreenId?: string) => void;
}) {
  const handleSelect = (option: { value: string; nextScreenId?: string }) => {
    if ("variableBinding" in screen && screen.variableBinding) {
      onSetVariable(screen.variableBinding, option.value);
    }
    onNext(option.value, option.nextScreenId);
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{screen.title}</h2>
        <p className="text-gray-600 mb-6">{interpolate(screen.question)}</p>

        <div className="space-y-3">
          {screen.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className="w-full p-4 text-left border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <span className="block text-sm text-gray-500 mt-1">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Multi-Select Renderer
function MultiSelectRenderer({
  screen,
  interpolate,
  onSetVariable,
  onNext,
}: {
  screen: MultiSelectScreen;
  interpolate: (text: string) => string;
  onSetVariable: (name: string, value: string[]) => void;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleContinue = () => {
    if (screen.variableBinding) {
      onSetVariable(screen.variableBinding, selected);
    }
    onNext();
  };

  const canContinue =
    !screen.minSelections || selected.length >= screen.minSelections;

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{screen.title}</h2>
        <p className="text-gray-600 mb-6">{interpolate(screen.question)}</p>

        <div className="space-y-3">
          {screen.options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.value)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                selected.includes(option.value)
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected.includes(option.value)
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selected.includes(option.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        onClick={handleContinue}
        disabled={!canContinue}
      >
        Continue
      </Button>
    </div>
  );
}

// Input Renderer
function InputRenderer({
  screen,
  interpolate,
  onSetVariable,
  onNext,
}: {
  screen: InputScreen;
  interpolate: (text: string) => string;
  onSetVariable: (name: string, value: string) => void;
  onNext: () => void;
}) {
  const [value, setValue] = useState("");

  const handleContinue = () => {
    if (screen.variableBinding) {
      onSetVariable(screen.variableBinding, value);
    }
    onNext();
  };

  const isRequired = screen.validation?.some((v) => v.type === "required");
  const canContinue = !isRequired || value.trim().length > 0;

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{screen.title}</h2>
        <p className="text-gray-600 mb-6">{interpolate(screen.prompt)}</p>

        {screen.inputType === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={screen.placeholder}
            className="w-full h-32 p-3 border rounded-lg resize-none"
          />
        ) : (
          <Input
            type={screen.inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={screen.placeholder}
            className="h-12 text-lg"
          />
        )}
      </div>

      <Button
        className="mt-6 w-full"
        onClick={handleContinue}
        disabled={!canContinue}
      >
        Continue
      </Button>
    </div>
  );
}

// Social Proof Renderer
function SocialProofRenderer({
  screen,
  variables,
  interpolate,
  onNext,
}: {
  screen: SocialProofScreen;
  variables: Record<string, unknown>;
  interpolate: (text: string) => string;
  onNext: () => void;
}) {
  const roleValue = String(variables[screen.roleVariable] || "");
  const variant =
    screen.variants[roleValue] || screen.variants[screen.defaultVariant];

  if (!variant) {
    return (
      <div className="p-6 text-center">
        <p>No variant configured</p>
        <Button className="mt-4" onClick={() => onNext()}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full items-center justify-center text-center">
      <div className="max-w-sm">
        <h2 className="text-2xl font-bold mb-4">{variant.headline}</h2>
        <p className="text-gray-600 mb-8">{interpolate(variant.copy)}</p>

        {variant.stats && variant.stats.length > 0 && (
          <div className="flex justify-center gap-8 mb-8">
            {variant.stats.map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <Button onClick={() => onNext()}>Continue</Button>
      </div>
    </div>
  );
}

// Interstitial Renderer
function InterstitialRenderer({
  screen,
  interpolate,
  onNext,
}: {
  screen: InterstitialScreen;
  interpolate: (text: string) => string;
  onNext: () => void;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Auto-advance messages and complete
  useState(() => {
    const messageInterval = screen.duration / screen.messages.length;
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= screen.messages.length - 1) {
          clearInterval(interval);
          setTimeout(() => onNext(), 500);
          return prev;
        }
        return prev + 1;
      });
    }, messageInterval);

    return () => clearInterval(interval);
  });

  const currentMessage = screen.messages[messageIndex];

  return (
    <div className="p-6 flex flex-col h-full items-center justify-center text-center">
      <h2 className="text-xl font-semibold mb-6">{screen.headline}</h2>

      {screen.animation === "spinner" && (
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-6" />
      )}

      {screen.animation === "progress-bar" && (
        <div className="w-64 h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${((messageIndex + 1) / screen.messages.length) * 100}%`,
            }}
          />
        </div>
      )}

      {screen.animation === "dots" && (
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}

      {currentMessage && (
        <p className="text-gray-600 animate-pulse">
          {interpolate(currentMessage.text)}
        </p>
      )}
    </div>
  );
}

// Account Creation Renderer
function AccountCreationRenderer({
  screen,
  interpolate,
  onNext,
}: {
  screen: AccountCreationScreen;
  interpolate: (text: string) => string;
  onNext: () => void;
}) {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{screen.headline}</h2>
        <p className="text-gray-600 mb-6">{interpolate(screen.copy)}</p>

        <div className="space-y-4">
          {screen.collectFields.includes("firstName") && (
            <Input placeholder="First Name" className="h-12" />
          )}
          {screen.collectFields.includes("lastName") && (
            <Input placeholder="Last Name" className="h-12" />
          )}
          {screen.collectFields.includes("email") && (
            <Input type="email" placeholder="Email" className="h-12" />
          )}
          {screen.collectFields.includes("password") && (
            <Input type="password" placeholder="Password" className="h-12" />
          )}
        </div>

        {screen.showSocialLogin && screen.socialProviders && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              {screen.socialProviders.map((provider) => (
                <Button key={provider} variant="outline" className="flex-1">
                  {provider}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button className="mt-6 w-full" onClick={() => onNext()}>
        Create Account
      </Button>
    </div>
  );
}

// SSO Handoff Renderer
function SSOHandoffRenderer({
  screen,
  interpolate,
}: {
  screen: SSOHandoffScreen;
  interpolate: (text: string) => string;
}) {
  return (
    <div className="p-6 flex flex-col h-full items-center justify-center text-center">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold mb-4">{screen.headline}</h2>
        <p className="text-gray-600 mb-8">{interpolate(screen.copy)}</p>
        <Button>{screen.actionLabel}</Button>
        <p className="text-xs text-gray-400 mt-4">
          This is a terminal screen - flow ends here
        </p>
      </div>
    </div>
  );
}

// Paywall Renderer
function PaywallRenderer({
  screen,
  interpolate,
  onNext,
}: {
  screen: PaywallScreen;
  interpolate: (text: string) => string;
  onNext: () => void;
}) {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">{screen.headline}</h2>

        <ul className="space-y-3 mb-8">
          {screen.valuePropositions.map((prop, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-green-500">✓</span>
              <span>{interpolate(prop)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <Button className="w-full" size="lg">
          {screen.primaryAction.label}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => onNext()}
        >
          {screen.secondaryAction.label}
        </Button>
      </div>
    </div>
  );
}

// Typing Test Renderer
function TypingTestRenderer({
  screen,
  interpolate,
  onSetVariable,
  onNext,
}: {
  screen: TypingTestScreen;
  interpolate: (text: string) => string;
  onSetVariable: (name: string, value: number) => void;
  onNext: () => void;
}) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setUserInput(e.target.value);
  };

  const handleComplete = () => {
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wordCount = screen.testText.split(" ").length;
      const wpm = Math.round(wordCount / elapsedMinutes);

      onSetVariable(screen.variableBindings.wpm, wpm);
      if (screen.variableBindings.accuracy) {
        // Simple accuracy calculation
        const correct = userInput
          .split("")
          .filter((c, i) => c === screen.testText[i]).length;
        const accuracy = Math.round((correct / screen.testText.length) * 100);
        onSetVariable(screen.variableBindings.accuracy, accuracy);
      }
    }
    onNext();
  };

  const isComplete = userInput.length >= screen.testText.length;

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{screen.title}</h2>
        <p className="text-gray-600 mb-6">{interpolate(screen.prompt)}</p>

        <div className="p-4 bg-gray-100 rounded-lg mb-4 font-mono">
          {screen.testText}
        </div>

        <Input
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing..."
          className="h-12 font-mono"
          autoFocus
        />
      </div>

      <Button
        className="mt-6 w-full"
        onClick={handleComplete}
        disabled={!isComplete}
      >
        {isComplete ? "See Results" : "Keep Typing..."}
      </Button>
    </div>
  );
}
