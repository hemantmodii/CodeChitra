import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// Define the function signature correctly
export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the target user by username from params
    const targetUser = await prisma.user.findUnique({
      where: { username: params.username },
    });

    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
      where: { userId: targetUser.id },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
