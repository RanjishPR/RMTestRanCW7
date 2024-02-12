# Upgrade applications without downtime (Zero Downtime Maintenance)

## Blue-Green-Deployment (`cf bg-deploy`) with application content.

The MTA uses the application content (`com.sap.application.content` `content-target: true`) feature to deploy the content instead of using a deploy er application.

### Initial Deployment

The content gets deployed.

### Successive Deployments

Content gets deployt in the *deployment phase*.

## Blue-Green-Deployment (`cf bg-deploy`) with content deployer application.

### Initial Deployment

### Successive Deployments

Content deployt via deployer apps is already deployed in the *deployment phase* and deployt a 2nd time when the application gets restaged in the *commit phase*.






```mermaid
graph TD

portal --> html5-repo --> srv --> db
```


```mermaid
graph TD

P1(portal-blue) --> H1(html5-repo-blue) --> S1(srv-blue) --> D1(db-blue)
P2(portal: none) --> H2(html5-repo: none) --> S2(srv-green) --> D2(db-green)
P3(portal-green) --> H3(html5-repo-green) --> S3(srv-green) --> D3(db-green)
```