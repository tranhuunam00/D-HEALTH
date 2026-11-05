import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createMasterCatalogsRouter(pool: Pool): Router {
  const router = Router();

  // 1. GET /facilities
  router.get('/facilities', async (req: Request, res: Response) => {
    const { all } = req.query;
    try {
      const query = all === 'true'
        ? 'SELECT * FROM master_facilities ORDER BY is_active DESC, name ASC'
        : 'SELECT * FROM master_facilities WHERE is_active = true ORDER BY name ASC';
      const result = await pool.query(query);
      res.json({ data: result.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. POST /facilities
  router.post('/facilities', async (req: Request, res: Response) => {
    const { code, name, short_name, facility_type, city, address, hotline, emergency_phone } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Tên cơ sở y tế là bắt buộc' });
    }

    const id = `fac_${Date.now()}`;
    const facCode = code?.trim() || `CSYT-${Math.floor(1000 + Math.random() * 9000)}`;
    const fType = facility_type || 'hospital_tw';
    const fCity = city || 'Hà Nội';
    const fAddress = address || 'Đang cập nhật';
    const fHotline = hotline || '1900-1000';

    try {
      const result = await pool.query(
        `INSERT INTO master_facilities 
         (id, code, name, short_name, facility_type, address, city, hotline, emergency_phone, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         RETURNING *`,
        [id, facCode, name.trim(), short_name || null, fType, fAddress, fCity, fHotline, emergency_phone || null]
      );
      res.status(201).json({ data: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. PUT /facilities/:id
  router.put('/facilities/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { code, name, short_name, facility_type, city, address, hotline, emergency_phone, is_active } = req.body;

    try {
      const result = await pool.query(
        `UPDATE master_facilities SET
           code = COALESCE($1, code),
           name = COALESCE($2, name),
           short_name = COALESCE($3, short_name),
           facility_type = COALESCE($4, facility_type),
           city = COALESCE($5, city),
           address = COALESCE($6, address),
           hotline = COALESCE($7, hotline),
           emergency_phone = COALESCE($8, emergency_phone),
           is_active = COALESCE($9, is_active),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [code, name, short_name, facility_type, city, address, hotline, emergency_phone, is_active, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy cơ sở y tế' });
      }
      res.json({ data: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. DELETE /facilities/:id (Soft delete toggle)
  router.delete('/facilities/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'UPDATE master_facilities SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy cơ sở y tế' });
      }
      res.json({ success: true, message: 'Đã ngừng kích hoạt cơ sở y tế', data: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. GET /departments
  router.get('/departments', async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM master_departments WHERE is_active = true ORDER BY name ASC');
      res.json({ data: result.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. GET /doctors
  router.get('/doctors', async (req: Request, res: Response) => {
    const { department_id, all } = req.query;
    try {
      let query = `
        SELECT d.*, f.name AS facility_name, dep.name AS department_name
        FROM master_doctors d
        LEFT JOIN master_facilities f ON d.facility_id = f.id
        LEFT JOIN master_departments dep ON d.department_id = dep.id
      `;
      const conditions: string[] = [];
      const params: any[] = [];

      if (all !== 'true') {
        conditions.push('d.is_active = true');
      }
      if (department_id) {
        params.push(department_id);
        conditions.push(`d.department_id = $${params.length}`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      query += ` ORDER BY d.is_active DESC, d.full_name ASC`;

      const result = await pool.query(query, params);
      res.json({ data: result.rows });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. POST /doctors
  router.post('/doctors', async (req: Request, res: Response) => {
    const { full_name, academic_title, facility_id, department_id, license_number, phone_number, email } = req.body;
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      return res.status(400).json({ error: 'Họ tên bác sĩ là bắt buộc' });
    }

    const id = `doc_${Date.now()}`;
    try {
      const result = await pool.query(
        `INSERT INTO master_doctors
         (id, facility_id, department_id, full_name, academic_title, license_number, phone_number, email, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
         RETURNING *`,
        [
          id,
          facility_id || null,
          department_id || null,
          full_name.trim(),
          academic_title || null,
          license_number || null,
          phone_number || null,
          email || null,
        ]
      );
      res.status(201).json({ data: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. PUT /doctors/:id
  router.put('/doctors/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { full_name, academic_title, facility_id, department_id, license_number, phone_number, email, is_active } = req.body;

    try {
      const result = await pool.query(
        `UPDATE master_doctors SET
           full_name = COALESCE($1, full_name),
           academic_title = COALESCE($2, academic_title),
           facility_id = COALESCE($3, facility_id),
           department_id = COALESCE($4, department_id),
           license_number = COALESCE($5, license_number),
           phone_number = COALESCE($6, phone_number),
           email = COALESCE($7, email),
           is_active = COALESCE($8, is_active),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [full_name, academic_title, facility_id, department_id, license_number, phone_number, email, is_active, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
      }
      res.json({ data: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. DELETE /doctors/:id (Soft delete toggle)
  router.delete('/doctors/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'UPDATE master_doctors SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
      }
      res.json({ success: true, message: 'Đã ngừng kích hoạt bác sĩ', data: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

