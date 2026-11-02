/**
 * Home Route Module
 * @description Route definitions for home/landing page
 */

import { router } from "@/application/route.js";
import * as controller from "@/modules/home/home.controller.js";

const route = router();

const basePath = "";

/**
 * @route GET /
 * @description Landing page showcasing the Express starter template
 * @access Public
 */
route.get("/", controller.index, {
	name: "home.index",
	basePath,
	description: "Landing page with starter template information and features",
	authenticated: false,
});

export const path = "/";
export default route.init();
