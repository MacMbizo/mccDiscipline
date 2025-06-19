
# Deployment Guide - MCC Discipline Tracker

## 🚀 Production Deployment

### Prerequisites

#### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: 20GB+ available space
- **Network**: Stable internet connection

#### Supabase Setup
1. **Create Supabase Project**:
   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Note project URL and anon key
   - Configure authentication providers

2. **Database Setup**:
   - Run database migrations
   - Seed initial data
   - Configure Row Level Security (RLS)
   - Set up database functions and triggers

3. **Authentication Configuration**:
   - Enable email/password authentication
   - Configure email templates
   - Set up OAuth providers (optional)
   - Configure password policies

### Build Process

#### Environment Configuration
Create production environment configuration:

```bash
# No .env file needed - using Supabase integration
# Configuration is handled through Supabase settings
```

#### Build Commands
```bash
# Install dependencies
npm ci --only=production

# Build for production
npm run build

# Preview build (optional)
npm run preview
```

#### Build Output
The build process creates:
- `dist/` directory with optimized static files
- Compressed JavaScript and CSS bundles
- Optimized images and assets
- Service worker for offline capability

### Hosting Options

#### Option 1: Vercel (Recommended)
1. **Connect Repository**:
   - Connect GitHub repository to Vercel
   - Configure build settings
   - Set environment variables

2. **Deploy Configuration**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm ci",
     "framework": "vite"
   }
   ```

3. **Domain Configuration**:
   - Add custom domain
   - Configure SSL certificates
   - Set up redirects

#### Option 2: Netlify
1. **Site Configuration**:
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Netlify Configuration** (`netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Option 3: Traditional Server
1. **Server Setup**:
   - Install Node.js and npm
   - Configure reverse proxy (nginx/Apache)
   - Set up SSL certificates
   - Configure firewall rules

2. **Deployment Script**:
   ```bash
   #!/bin/bash
   # deploy.sh
   
   # Pull latest code
   git pull origin main
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Restart web server
   sudo systemctl reload nginx
   ```

### Database Migration

#### Migration Process
1. **Backup Current Data**:
   ```bash
   # Create backup before migration
   pg_dump -h [host] -U [user] [database] > backup.sql
   ```

2. **Run Migrations**:
   ```sql
   -- Apply database schema changes
   -- Migrate existing data
   -- Update constraints and indexes
   ```

3. **Verify Migration**:
   - Test all functionality
   - Verify data integrity
   - Check performance metrics

#### Data Seeding
```sql
-- Insert initial misdemeanors and sanctions
INSERT INTO misdemeanors (location, name, sanctions, severity_level)
VALUES ('Main School', 'Dropping Litter', '{"1st": "Picking up litter (15 minutes)"}', 1);

-- Insert default merit tiers
INSERT INTO merit_tiers (name, points, description)
VALUES ('Bronze', 1, 'Basic achievement recognition');
```

### Security Configuration

#### SSL/TLS Setup
1. **Certificate Installation**:
   - Obtain SSL certificate (Let's Encrypt recommended)
   - Configure automatic renewal
   - Set up HTTPS redirect

2. **Security Headers**:
   ```nginx
   # nginx configuration
   add_header X-Frame-Options DENY;
   add_header X-Content-Type-Options nosniff;
   add_header X-XSS-Protection "1; mode=block";
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
   ```

#### Database Security
1. **Connection Security**:
   - Use SSL connections only
   - Restrict database access by IP
   - Configure connection pooling
   - Set up database user permissions

2. **Row Level Security**:
   - Enable RLS on all tables
   - Configure appropriate policies
   - Test access controls
   - Monitor security events

### Performance Optimization

#### CDN Configuration
1. **Static Asset Delivery**:
   - Configure CDN for static files
   - Set appropriate cache headers
   - Enable gzip compression
   - Optimize image delivery

2. **Cache Strategy**:
   ```
   # Cache static assets for 1 year
   Cache-Control: max-age=31536000
   
   # Cache API responses for 5 minutes
   Cache-Control: max-age=300
   ```

#### Database Optimization
1. **Query Optimization**:
   - Add appropriate indexes
   - Optimize slow queries
   - Configure connection pooling
   - Monitor query performance

2. **Connection Management**:
   ```
   # PostgreSQL configuration
   max_connections = 100
   shared_buffers = 256MB
   effective_cache_size = 1GB
   ```

### Monitoring and Logging

#### Application Monitoring
1. **Error Tracking**:
   - Set up error monitoring service
   - Configure alert thresholds
   - Track performance metrics
   - Monitor user experience

2. **Log Management**:
   ```javascript
   // Production logging configuration
   console.log = production ? () => {} : console.log;
   console.error = (error) => {
     // Send to error tracking service
     errorTracker.captureException(error);
   };
   ```

#### Health Checks
1. **Application Health**:
   ```javascript
   // Health check endpoint
   app.get('/health', (req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       version: process.env.npm_package_version
     });
   });
   ```

2. **Database Health**:
   ```sql
   -- Database health check
   SELECT 
     count(*) as total_records,
     max(created_at) as latest_record
   FROM behavior_records;
   ```

### Backup and Recovery

#### Automated Backups
1. **Database Backups**:
   ```bash
   #!/bin/bash
   # backup-db.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_FILE="backup_$DATE.sql"
   
   pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE
   
   # Upload to cloud storage
   aws s3 cp $BACKUP_FILE s3://backup-bucket/
   
   # Cleanup old backups
   find . -name "backup_*.sql" -mtime +7 -delete
   ```

2. **File Backups**:
   ```bash
   # Backup uploaded files and configurations
   tar -czf app_backup_$(date +%Y%m%d).tar.gz \
     uploads/ \
     config/ \
     logs/
   ```

#### Recovery Procedures
1. **Database Recovery**:
   ```bash
   # Restore from backup
   psql -h $DB_HOST -U $DB_USER $DB_NAME < backup_file.sql
   ```

2. **Application Recovery**:
   ```bash
   # Restore application files
   tar -xzf app_backup.tar.gz
   
   # Restart services
   sudo systemctl restart nginx
   sudo systemctl restart application
   ```

### Scaling Considerations

#### Horizontal Scaling
1. **Load Balancing**:
   ```nginx
   upstream app_servers {
     server app1.example.com;
     server app2.example.com;
     server app3.example.com;
   }
   
   server {
     listen 80;
     location / {
       proxy_pass http://app_servers;
     }
   }
   ```

2. **Database Scaling**:
   - Read replicas for query distribution
   - Connection pooling optimization
   - Query result caching
   - Database partitioning

#### Vertical Scaling
1. **Resource Optimization**:
   - Monitor CPU and memory usage
   - Optimize application performance
   - Tune database configuration
   - Implement efficient caching

### Maintenance Procedures

#### Regular Maintenance
1. **Weekly Tasks**:
   - Review error logs
   - Check backup integrity
   - Monitor performance metrics
   - Update security patches

2. **Monthly Tasks**:
   - Database maintenance (VACUUM, ANALYZE)
   - SSL certificate renewal check
   - Security audit
   - Performance optimization review

#### Update Procedures
1. **Application Updates**:
   ```bash
   # Blue-green deployment
   # 1. Deploy to staging environment
   # 2. Run tests and validation
   # 3. Switch traffic to new version
   # 4. Monitor for issues
   # 5. Rollback if necessary
   ```

2. **Database Updates**:
   ```sql
   -- Schema updates with transactions
   BEGIN;
   -- Apply changes
   COMMIT;
   ```

### Troubleshooting

#### Common Issues
1. **Application Won't Start**:
   - Check Node.js version compatibility
   - Verify environment variables
   - Review error logs
   - Check file permissions

2. **Database Connection Issues**:
   - Verify connection strings
   - Check firewall rules
   - Review SSL configuration
   - Monitor connection limits

3. **Performance Problems**:
   - Analyze slow queries
   - Check resource utilization
   - Review cache hit rates
   - Monitor network latency

#### Emergency Procedures
1. **Service Outage**:
   - Activate incident response plan
   - Switch to backup systems
   - Communicate with stakeholders
   - Document incident details

2. **Security Incident**:
   - Isolate affected systems
   - Change all passwords
   - Review access logs
   - Notify relevant authorities

### Rollback Procedures

#### Application Rollback
```bash
# Quick rollback script
#!/bin/bash

# Rollback to previous version
git checkout previous-stable-tag

# Rebuild application
npm ci --only=production
npm run build

# Restart services
sudo systemctl restart application
```

#### Database Rollback
```sql
-- Rollback database changes
BEGIN;
-- Reverse migration steps
ROLLBACK;

-- Restore from backup if necessary
```

### Post-Deployment Checklist

#### Verification Steps
- [ ] Application loads correctly
- [ ] User authentication works
- [ ] Database connections established
- [ ] All features functional
- [ ] Performance meets requirements
- [ ] Security headers configured
- [ ] SSL certificates valid
- [ ] Backups running successfully
- [ ] Monitoring alerts configured
- [ ] Error tracking operational

#### User Communication
1. **Deployment Notification**:
   - Inform users of maintenance window
   - Communicate new features
   - Provide updated documentation
   - Share contact information for issues

2. **Training and Support**:
   - Conduct user training sessions
   - Update help documentation
   - Provide support contact information
   - Monitor user feedback
