import sql from '@/app/api/utils/sql';

// Submit a contact form
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, recaptcha_token } = body;

    if (!name || !email || !message) {
      return Response.json({ 
        error: 'Name, email, and message are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // TODO: Verify reCAPTCHA token with Google
    // For now, we'll skip this verification in the MVP
    if (process.env.RECAPTCHA_SECRET_KEY && recaptcha_token) {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha_token}`,
      });

      const recaptchaData = await recaptchaResponse.json();
      if (!recaptchaData.success) {
        return Response.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
      }
    }

    // Save contact submission to database
    const [submission] = await sql`
      INSERT INTO contact_submissions (
        name,
        email,
        subject,
        message
      ) VALUES (
        ${name},
        ${email},
        ${subject || 'General Inquiry'},
        ${message}
      )
      RETURNING id, created_at
    `;

    // TODO: Send email notification to support team
    // This would typically use SendGrid, AWS SES, or similar service
    console.log('New contact submission:', {
      id: submission.id,
      name,
      email,
      subject: subject || 'General Inquiry',
      message: message.substring(0, 100) + '...'
    });

    return Response.json({ 
      message: 'Thank you for your message! We\'ll get back to you soon.',
      submission_id: submission.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get contact submissions (admin only)
export async function GET(request) {
  try {
    // TODO: Add admin authentication check
    // For now, this is a placeholder for the admin panel
    
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const resolved = url.searchParams.get('resolved');

    let query = `
      SELECT 
        id,
        name,
        email,
        subject,
        message,
        is_resolved,
        created_at
      FROM contact_submissions
    `;
    
    const values = [];
    let paramCount = 1;

    if (resolved !== null) {
      query += ` WHERE is_resolved = $${paramCount++}`;
      values.push(resolved === 'true');
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(limit, offset);

    const submissions = await sql(query, values);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM contact_submissions`;
    const countValues = [];
    
    if (resolved !== null) {
      countQuery += ` WHERE is_resolved = $1`;
      countValues.push(resolved === 'true');
    }

    const [{ total }] = await sql(countQuery, countValues);

    return Response.json({ 
      submissions, 
      pagination: {
        total: parseInt(total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(total)
      }
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}