
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth-utils';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ branchId: string }> }
) {
    try {
        const userId = await getAuthUserId(req);
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { branchId } = await params;

        // 1. Fetch current branch and its chat to verify ownership
        const branch = await prisma.branches.findUnique({
            where: { branch_id: branchId },
            include: { chat: true }
        });

        if (!branch || branch.chat.user_id !== userId) {
            return new NextResponse("Branch not found", { status: 404 });
        }

        // 2. Fetch all blocks for this branch (linear history)
        const blocks = await prisma.block.findMany({
            where: { branch_id: branchId },
            orderBy: { created_at: 'asc' }
        });

        // 3. Build Gemni-style history
        const history = [];

        // If it's a sub-branch, conceptually you might want to prepend parent branch blocks
        // But for this simplified "build history for a branch" API, we'll focus on the branch itself
        // Recursive parent history can be added here if needed.

        for (const block of blocks) {
            if (block.user_content) {
                history.push({ role: 'user', content: block.user_content });
            }
            if (block.ai_content) {
                history.push({ role: 'assistant', content: block.ai_content });
            }
        }

        return NextResponse.json({ history });

    } catch (error) {
        console.error("[BRANCH_HISTORY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
