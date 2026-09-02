import type { ObsConnectionSettingsUpdate } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/toast";
import { Wifi } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/providers/settings-provider";
import { type Theme, useTheme } from "../providers/theme-provider";

const PASSWORD_EDIT_SENTINEL = "<edit>";

const themeOptions = [
    { label: "System", value: "system" },
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" }
];

function getPasswordPlaceholder(hasPassword: boolean) {
    return hasPassword ? "Leave blank to clear" : "No password set";
}

export function SettingsDialog() {
    const { theme, setTheme } = useTheme();
    const { websocketUrl, setWebsocketUrl, hasWebsocketPassword, setHasWebsocketPassword } = useSettings();
    const [url, setUrl] = useState(websocketUrl);
    const [password, setPassword] = useState(hasWebsocketPassword ? PASSWORD_EDIT_SENTINEL : "");

    const urlChanged = url !== websocketUrl;
    const passwordUnchanged = (hasWebsocketPassword && password === PASSWORD_EDIT_SENTINEL) || (!hasWebsocketPassword && password === "");
    const passwordChanged = !passwordUnchanged;
    const hasChanges = urlChanged || passwordChanged;

    async function submit() {
        const body: ObsConnectionSettingsUpdate = {};

        if (urlChanged) body.url = url;
        if (passwordChanged) body.password = password;

        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error(`Failed to save settings: ${response.status}`);

            if (urlChanged) setWebsocketUrl(url);
            if (passwordChanged) setHasWebsocketPassword(Boolean(password));
            toast.add({ description: "Settings saved successfully.", type: "success" });
        } catch (error) {
            toast.add({ description: "Couldn't save settings.", type: "error" });
            console.error(error);
        }
    }

    return (
        <>
            <DialogHeader className="gap-0">
                <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
            </DialogHeader>

            <Field className="w-45">
                <FieldLabel>Theme</FieldLabel>
                <Select items={themeOptions} onValueChange={(v) => setTheme(v as Theme)} value={theme}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {themeOptions.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>

            <FieldSet>
                <FieldLegend className="font-semibold flex gap-1 align-middle">
                    <Wifi className="size-5" /> OBS Connection
                </FieldLegend>
                <FieldDescription>Configure the OBS WebSocket connection.</FieldDescription>

                <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>
                            URL <span className="text-destructive">*</span>
                        </FieldLabel>
                        <FieldDescription>Local URL for the WebSocket.</FieldDescription>
                        <Input
                            id="url"
                            type="text"
                            placeholder="ws://127.0.0.1:4455"
                            value={url}
                            maxLength={30}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Password</FieldLabel>
                        <FieldDescription>Optional, but strongly advise using it.</FieldDescription>
                        <Input
                            id="password"
                            type={password === PASSWORD_EDIT_SENTINEL ? "text" : "password"}
                            placeholder={getPasswordPlaceholder(hasWebsocketPassword)}
                            value={password}
                            maxLength={50}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <DialogFooter>
                <Button type="submit" disabled={!hasChanges || url === ""} onClick={submit}>
                    Save changes
                </Button>
            </DialogFooter>
        </>
    );
}
