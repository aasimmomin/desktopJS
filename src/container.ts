import { ContainerWindowManager, ContainerWindow } from "./window";
import { ContainerNotificationManager } from "./notification";
import { TrayIconDetails } from "./tray";
import { MenuItem } from "./menu";
import { Guid } from "./guid";

/**
 * Represents a concrete container.
 * @extends ContainerWindowManager
 * @extends ContainerNotificationManager
 */
export interface Container extends ContainerWindowManager, ContainerNotificationManager {
    /**
     * Display type of current Container.
     * @type {string}
     */
    hostType: string;

    /**
     * Unique v4 GUID for this Container instance
     * @type {string}
     */
    uuid: string;

    /**
     * Adds an icon and context menu to the system notification area.
     * @param {TrayIconDetails} details Details for the tray icon.
     * @param listener (Optional) Callback for when the tray icon is clicked.
     * @param {MenuItem[]} menuItems (Optional) Context menu.
     */
    addTrayIcon(details: TrayIconDetails, listener?: () => void, menuItems?: MenuItem[]);
}

/**
 * Represents a common Container to be used as a base for any custom Container implementation.
 * @augments Container
 */
export abstract class ContainerBase implements Container {
    public hostType: string;
    public uuid: string = Guid.newGuid();

    abstract getMainWindow(): ContainerWindow;

    abstract showWindow(url: string, options?: any): ContainerWindow;

    showNotification(options: NotificationOptions) {
        throw new TypeError("Notifications not supported by this container");
    }

    addTrayIcon(details: TrayIconDetails, listener?: () => void, menuItems?: MenuItem[]) {
        throw new TypeError("Tray icons are not supported by this container.");
    }
}

/**
 * Represents a common Container to be used as a base for any custom web based implementation.
 * @extends ContainerBase
 */
export abstract class WebContainerBase extends ContainerBase {
    protected globalWindow: Window;
    private linkHelper: any;

    public constructor(win?: Window) {
        super();

        this.globalWindow = win || (typeof window !== "undefined" && window) || null;

        // Create helper link for ensuring absolute urls
        this.linkHelper = { href: "unknown" };
        try {
            this.linkHelper = this.globalWindow.top.document.createElement("a");
        } catch (e) { /* Swallow */ }
    }

    /**
     * Returns an absolute url
     * @param {string} url url
     * @returns {string} An absolute url
     */
    protected ensureAbsoluteUrl(url: string): string {
        if (this.linkHelper) {
            this.linkHelper.href = url;
            return this.linkHelper.href;
        } else {
            return url;
        }
    }
}