export type AdminContactStatusUpdate =
  | { ok: false }
  | {
      ok: true;
      value: {
        id: string;
        answeared: boolean;
      };
    };

export function parseAdminContactStatusUpdate(
  body: unknown,
): AdminContactStatusUpdate;

export function buildAdminContactStatusPayload(
  id: string,
  answeared: boolean,
): {
  data: {
    id: string;
    type: 'item';
    attributes: {
      answeared: boolean;
    };
  };
};
