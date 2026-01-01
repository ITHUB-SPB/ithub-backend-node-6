/**
 * Error Handling Middleware
 */

import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import env from "@/application/env";
import { INTERNAL_SERVER_ERROR, OK } from "@/lib/http-status-codes";

/**
 * Error handling middleware for Express.
 *
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Response} JSON response with error details
 */
const onError: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
    const currentStatus = "status" in err ? err.status : res.statusCode;
    const statusCode = currentStatus !== OK ? currentStatus : INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        message: err.message,
        stack: env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

export default onError;
