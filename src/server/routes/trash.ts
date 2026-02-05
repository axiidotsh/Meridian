import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { authMiddleware } from '../middleware/auth';

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

const bulkActionSchema = z.object({
  type: z.enum(['tasks', 'habits', 'sessions']),
  ids: z.array(z.string()).min(1).max(100),
});

export const trashRouter = new Hono()
  .use(authMiddleware)
  .get('/counts', async (c) => {
    const user = c.get('user');

    const [tasks, habits, sessions] = await Promise.all([
      db.task.count({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
      db.habit.count({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
      db.focusSession.count({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
    ]);

    return c.json({ tasks, habits, sessions });
  })
  .get('/tasks', zValidator('query', paginationSchema), async (c) => {
    const user = c.get('user');
    const { limit, offset } = c.req.valid('query');

    const [tasks, totalCount] = await Promise.all([
      db.task.findMany({
        where: { userId: user.id, deletedAt: { not: null } },
        include: {
          project: { select: { id: true, name: true, color: true } },
        },
        orderBy: { deletedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.task.count({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
    ]);

    const hasMore = offset + limit < totalCount;
    const nextOffset = hasMore ? offset + limit : null;

    return c.json({ tasks, nextOffset });
  })
  .get('/habits', zValidator('query', paginationSchema), async (c) => {
    const user = c.get('user');
    const { limit, offset } = c.req.valid('query');

    const [habits, totalCount] = await Promise.all([
      db.habit.findMany({
        where: { userId: user.id, deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.habit.count({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
    ]);

    const hasMore = offset + limit < totalCount;
    const nextOffset = hasMore ? offset + limit : null;

    return c.json({ habits, nextOffset });
  })
  .get('/sessions', zValidator('query', paginationSchema), async (c) => {
    const user = c.get('user');
    const { limit, offset } = c.req.valid('query');

    const [sessions, totalCount] = await Promise.all([
      db.focusSession.findMany({
        where: { userId: user.id, deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.focusSession.count({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
    ]);

    const hasMore = offset + limit < totalCount;
    const nextOffset = hasMore ? offset + limit : null;

    return c.json({ sessions, nextOffset });
  })
  .post('/tasks/:id/restore', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const task = await db.task.findFirst({
      where: { id, userId: user.id, deletedAt: { not: null } },
    });

    if (!task) {
      return c.json({ error: 'Task not found in trash' }, 404);
    }

    await db.task.update({ where: { id }, data: { deletedAt: null } });

    return c.json({ success: true });
  })
  .post('/habits/:id/restore', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const habit = await db.habit.findFirst({
      where: { id, userId: user.id, deletedAt: { not: null } },
    });

    if (!habit) {
      return c.json({ error: 'Habit not found in trash' }, 404);
    }

    await db.habit.update({ where: { id }, data: { deletedAt: null } });

    return c.json({ success: true });
  })
  .post('/sessions/:id/restore', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const session = await db.focusSession.findFirst({
      where: { id, userId: user.id, deletedAt: { not: null } },
    });

    if (!session) {
      return c.json({ error: 'Session not found in trash' }, 404);
    }

    await db.focusSession.update({
      where: { id },
      data: { deletedAt: null },
    });

    return c.json({ success: true });
  })
  .post('/bulk-restore', zValidator('json', bulkActionSchema), async (c) => {
    const user = c.get('user');
    const { type, ids } = c.req.valid('json');

    const model =
      type === 'tasks'
        ? db.task
        : type === 'habits'
          ? db.habit
          : db.focusSession;

    await (model as typeof db.task).updateMany({
      where: {
        id: { in: ids },
        userId: user.id,
        deletedAt: { not: null },
      },
      data: { deletedAt: null },
    });

    return c.json({ success: true });
  })
  .post('/bulk-delete', zValidator('json', bulkActionSchema), async (c) => {
    const user = c.get('user');
    const { type, ids } = c.req.valid('json');

    if (type === 'tasks') {
      await db.task.deleteMany({
        where: { id: { in: ids }, userId: user.id, deletedAt: { not: null } },
      });
    } else if (type === 'habits') {
      await db.habit.deleteMany({
        where: { id: { in: ids }, userId: user.id, deletedAt: { not: null } },
      });
    } else {
      await db.focusSession.deleteMany({
        where: { id: { in: ids }, userId: user.id, deletedAt: { not: null } },
      });
    }

    return c.json({ success: true });
  })
  .delete('/all', async (c) => {
    const user = c.get('user');

    await Promise.all([
      db.task.deleteMany({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
      db.habit.deleteMany({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
      db.focusSession.deleteMany({
        where: { userId: user.id, deletedAt: { not: null } },
      }),
    ]);

    return c.json({ success: true });
  })
  .delete('/tasks/all', async (c) => {
    const user = c.get('user');

    await db.task.deleteMany({
      where: { userId: user.id, deletedAt: { not: null } },
    });

    return c.json({ success: true });
  })
  .delete('/habits/all', async (c) => {
    const user = c.get('user');

    await db.habit.deleteMany({
      where: { userId: user.id, deletedAt: { not: null } },
    });

    return c.json({ success: true });
  })
  .delete('/sessions/all', async (c) => {
    const user = c.get('user');

    await db.focusSession.deleteMany({
      where: { userId: user.id, deletedAt: { not: null } },
    });

    return c.json({ success: true });
  })
  .delete('/tasks/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const task = await db.task.findFirst({
      where: { id, userId: user.id, deletedAt: { not: null } },
    });

    if (!task) {
      return c.json({ error: 'Task not found in trash' }, 404);
    }

    await db.task.delete({ where: { id } });

    return c.json({ success: true });
  })
  .delete('/habits/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const habit = await db.habit.findFirst({
      where: { id, userId: user.id, deletedAt: { not: null } },
    });

    if (!habit) {
      return c.json({ error: 'Habit not found in trash' }, 404);
    }

    await db.habit.delete({ where: { id } });

    return c.json({ success: true });
  })
  .delete('/sessions/:id', async (c) => {
    const user = c.get('user');
    const { id } = c.req.param();

    const session = await db.focusSession.findFirst({
      where: { id, userId: user.id, deletedAt: { not: null } },
    });

    if (!session) {
      return c.json({ error: 'Session not found in trash' }, 404);
    }

    await db.focusSession.delete({ where: { id } });

    return c.json({ success: true });
  });

export type AppType = typeof trashRouter;
