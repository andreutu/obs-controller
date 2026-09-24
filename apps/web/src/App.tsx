import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog";
import { Settings, Terminal } from "lucide-react";
import { ConnectionDialog } from "./components/connection";
import { SettingsDialog } from "./components/settings";

export function App() {
    async function handleClick() {
        const response = await fetch("/api/health");
        console.log(response);
    }

    return (
        <div className="flex min-h-svh overflow-y-hidden">
            <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
                <div>
                    <h1 className="font-medium">Project ready!</h1>
                    <p>You may now add components and start building.</p>
                    <p>We&apos;ve already added the button component for you.</p>
                    <Button onClick={handleClick} className="mt-2">
                        Button
                    </Button>
                </div>
                <div className="text-muted-foreground font-mono text-xs">
                    (Press <kbd>d</kbd> to toggle dark mode)
                </div>
            </div>
            <div className="absolute bottom-0 border-t w-full min-h-10 flex flex-row-reverse items-center">
                <Dialog>
                    <DialogTrigger
                        render={
                            <Button
                                className="h-10 w-10 m-0 p-0 rounded-none border-l-border bg-transparent active:bg-d/10 active:translate-y-0!"
                                variant="secondary"
                            >
                                <Settings className="size-6 dark:text-neutral-600 text-neutral-400" />
                            </Button>
                        }
                    />
                    <DialogContent className="max-w-200!">
                        <SettingsDialog />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger
                        render={
                            <Button
                                className="h-10 w-10 m-0 p-0 rounded-none border-l-border bg-transparent active:bg-d/10 active:translate-y-0!"
                                variant="secondary"
                            >
                                <Terminal className="size-6 dark:text-neutral-600 text-neutral-400" />
                            </Button>
                        }
                    />
                    <DialogContent className="max-w-200!">
                        <ConnectionDialog />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
