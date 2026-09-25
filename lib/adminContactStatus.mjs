export function parseAdminContactStatusUpdate(body) {
  const id = typeof body?.id === 'string' ? body.id.trim() : '';
  const answeared = body?.answeared;

  if (!id || typeof answeared !== 'boolean') {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      id,
      answeared,
    },
  };
}

export function buildAdminContactStatusPayload(id, answeared) {
  return {
    data: {
      id,
      type: 'item',
      attributes: {
        answeared,
      },
    },
  };
}
