import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import { GraphQLError } from "graphql/error";

@Injectable()
export class GqlThrottleGuard extends ThrottlerGuard {
    protected getRequestResponse(context: ExecutionContext): { req: Record<string, any>; res: Record<string, any>; } {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        return { 
            req: ctx?.req || ctx, 
            res: ctx?.res || {} 
        };
    }
    protected throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
        throw new GraphQLError("Rate limit exceeded. Slow down.", {
            extensions: { code: "RATE_LIMIT" },
        });
    }
}